class RealEstatesController < ApplicationController
	layout 'layout_front'

	def index
	end

	def demo
	end

	def estimate
	end

	def category

	end

	# List

		# View
		# params: search params
		def list
			redirect_to '/bat-dong-san' if params[:search].blank?

			@res = RealEstate.search_with_params params[:search].clone
		end

		# Partial view
		# params: search params, page
		def _list_list
			per = 8

			params[:page] ||= 1
			params[:page] = params[:page].to_i

			res = RealEstate.search_with_params params[:search]

			count = res.count

			return render json: { status: 1 } if count == 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'real_estates/item_list', locals: { res: res.page(params[:page], per) }),
					pagination: render_to_string(partial: 'shared/pagination_2', locals: { total: count, per: per, page: params[:page] })
				}
			}
		end

	# / List

	# View
		
		# View
		# params: slug(*)
		def view
			id = params[:slug][((params[:slug].rindex('-') || -1) + 1)...params[:slug].length]

			@re = RealEstate.find id

			# Author
			authorize! :view, @re

			session[:real_estate_viewed] ||= []
			unless session[:real_estate_viewed].include? id
				@re.update(view_count: @re.view_count + 1)
				session[:real_estate_viewed] << params[:id]
			end
		end

	# / View

	# Create

		# View
		# params: id (if edit)
		def create
			if params.has_key? :id
				begin
					@re = RealEstate.find params[:id]
				rescue
					@re = RealEstate.new
				end
			else
				@re = RealEstate.new
			end
			
			# Author
			if @re.new_record?
				authorize! :create, RealEstate
				@is_appraisal = params.has_key? :appraisal
			else
				authorize! :edit, @re
				@is_appraisal = @re.appraisal_type != 0

				if @re.user_id == 0
					@re.params['remote_ip'] = request.remote_ip
					@re.save
				end
			end

			render layout: 'layout_back'
		end  

		# Handle
		# params: real-estate form
		def save
			is_draft = params.has_key? :draft

			if params[:real_estate][:id].blank?
				params[:real_estate][:user_id] = signed? ? current_user.id : 0
				real_estate = RealEstate.new
			else 
				real_estate = RealEstate.find(params[:real_estate][:id])
				return render json: { status: 1 } if real_estate.nil?
			end

			unless signed?
				params[:real_estate][:remote_ip] = request.remote_ip
			end

			result = real_estate.save_with_params(params[:real_estate], is_draft)

			return render json: result if result[:status] != 0

			# if !signed? && params[:real_estate][:id].blank?
			# 	RealEstateMailer.active(real_estate).deliver_later
			# end

			render json: { status: 0, result: real_estate.id }
		end

		# Handle => View
		# params: id, secure_code
		def active
			result = RealEstate.active params[:id], params[:secure_code]

			return redirect_to '/' if result[:status] != 0

			@status = result[:result]
			render layout: 'layout_back'
		end

	# / Create

	# Block create

		# Partial view
		# params: block_id(*)
		def _block_create
			@is_create_new = params[:id].blank?
			if @is_create_new
				# Create
				@block = Block.find params[:block_id]
				@selected_group = BlockRealEstateGroup.find params[:group_id]
				@re = RealEstate.new
			else
				# Edit
				@re = RealEstate.find(params[:id])
				@selected_group = @re.block_group
				@block = @re.block
			end


			render json: { status: 0, result: render_to_string(partial: 'real_estates/block_create') }
		end

		# Handle
		# params: real_estate form
		def block_save
			params[:real_estate][:user_id] = current_user.id

			re = params[:real_estate][:id].blank? ? RealEstate.new : RealEstate.find(params[:real_estate][:id])

			result = re.block_save_with_params params[:real_estate]

			return render json: result if result[:status] != 0

			render json: { status: 0, result: re.id }
		end

	# / Block create

	# Block list

		# Partial view
		# params: block_id(*)
		def _block_item_list
			groups = BlockRealEstateGroup.where block_id: params[:block_id]

			render json: {
				status: 0,
				result: render_to_string(partial: 'real_estates/block_item_list', locals: { groups: groups })
			}
		end

		# Partial view
		# params: block_id(*)
		def _block_description_item_list
			groups = BlockRealEstateGroup.where block_id: params[:block_id]

			render json: {
				status: 0,
				result: render_to_string(partial: 'real_estates/block_description_item_list', locals: { groups: groups })
			}
		end

	# / Block list

	# Interact image

		# Get values
		# params: id(*)
		def get_image_for_interact_build
			# Result for request
			images = []

			# Get block's image
			real_estate_group_images = BlockRealEstateGroupImage.where(block_real_estate_group_id: params[:id])

			# Get all info of each image
			real_estate_group_images.each do |real_estate_group_image|
				image = {}

				# Get url for display
				image[:id] = real_estate_group_image.id
				image[:url] = real_estate_group_image.image.url
				image[:thumb_url] = real_estate_group_image.image.url('thumb')

				if real_estate_group_image.image_descriptions.present?
					image[:descriptions] = []

					real_estate_group_image.image_descriptions.each do |image_description|
						description = { tag_name: image_description.area_type }

						# Area info
						case image_description.area_type
						when 'polyline'
							description[:points] = image_description.area_info['points']
						else
							next
						end

						# Description info
						description[:description] = { type: image_description.description_type }
						case image_description.description_type
						when 'text_image'
							description[:description][:data] = {}
							if image_description.text_description.present?
								description[:description][:data][:description] = image_description.text_description.description
							end

							if image_description.image_descriptions.present?
								image_data = []
								image_description.image_descriptions.each do |data|
									image_data << { id: data.id, url: data.image.url, description: data.description, is_avatar: data.is_avatar }
								end
								description[:description][:data][:images] = image_data.to_json
							end
						end

						image[:descriptions] << description
					end
				end

				images << image
			end

			render json: { status: 0, result: images }
		end

		# Handle
		# params: data(*)
		def save_interact_images
			render json: BlockRealEstateGroupImage.save_description(JSON.parse(params[:data]))
		end

		# Get values
		# params: id(*)
		def get_data_for_interact_view

			# Images

				# Result for request
				images = []

				# Get block's image
				real_estate_group_images = BlockRealEstateGroupImage.where(block_real_estate_group_id: params[:id])

				# Get all info of each image
				real_estate_group_images.each do |real_estate_group_image|
					image = {}

					# Get url for display
					image[:thumb_url] = real_estate_group_image.image.url('thumb')

					if real_estate_group_image.image_descriptions.present?
						image[:descriptions] = []

						real_estate_group_image.image_descriptions.each do |image_description|
							description = { tag_name: image_description.area_type }

							# Area info
							case image_description.area_type
							when 'polyline'
								description[:points] = image_description.area_info['points']
							else
								next
							end

							# Description info
							description[:description] = { type: image_description.description_type }
							case image_description.description_type
							when 'text_image'
								description[:description][:data] = {}
								if image_description.text_description.present?
									description[:description][:data][:description] = image_description.text_description.description
								end

								if image_description.image_descriptions.present?
									image_data = []
									image_description.image_descriptions.each do |data|
										image_data << { id: data.id, url: data.image.url, description: data.description, is_avatar: data.is_avatar }
									end
									description[:description][:data][:images] = image_data.to_json
								end
							end

							image[:descriptions] << description
						end
					end

				# / Images

				render json: { 
					status: 0, 
					result: {
						images: images 
					} 
				}
			end

			render json: { status: 0, result: images }
		end


	# / Interact image

	# My list

		# View
		def my
			# Author
			authorize! :view_my, RealEstate

			@res = RealEstate.my_search_with_params interact: 'desc'

			render layout: 'layout_back'
		end

		# Partial view
		# params: keyword, page
		def _my_list
			# Author
			return render json: { status: 6 } if cannot? :view_my, RealEstate

			per = Rails.application.config.item_per_page

			params[:page] ||= 1
			params[:page] = params[:page].to_i

			res = RealEstate.my_search_with_params params

			count = res.count

			return render json: { status: 1 } if count == 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'real_estates/my_list', locals: { res: res.page(params[:page], per) }),
					pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per, page: params[:page] })
				}
			}
		end

		def change_show_status
			RealEstate.update_show_status params[:id], params[:is_show]

			render json: Hash[status: 0]
		end

	# / My list

	# My favorite list

		# View
		def my_favorite
			# Author
			authorize! :view_my_favorite, RealEstate

			@res = RealEstate.my_favorite_search_with_params interact: 'desc'

			render layout: 'layout_back'
		end

		# Partial view
		# params: keyword, page
		def _my_favorite_list
			# Author
			return render json: { status: 6 } if cannot? :view_my_favorite, RealEstate

			per = Rails.application.config.item_per_page

			params[:page] ||= 1
			params[:page] = params[:page].to_i

			res = RealEstate.my_favorite_search_with_params params

			count = res.count

			return render json: { status: 1 } if count === 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'real_estates/my_favorite_list', locals: { res: res.page(params[:page], per) }),
					pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per, page: params[:page] })
				}
			}
		end

	# / My favorite list

	# Pending

		# View
		def pending
			# Author
			authorize! :approve, RealEstate

			@res = RealEstate.pending_search_with_params interact: 'desc'

			render layout: 'layout_back'
		end

		# Partial view
		# params: keyword
		def _pending_list
			# Author
			return render json: { staus: 6 } if cannot? :approve, RealEstate

			per = Rails.application.config.item_per_page
			
			params[:page] ||= 1
			params[:page] = params[:page].to_i

			res = RealEstate.pending_search_with_params params

			count = res.count

			return render json: { status: 1 } if count == 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'real_estates/pending_list', locals: { res: res.page(params[:page], per) }),
					pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per, page: params[:page] })
				}
			}
		end

		# Handle
		# params: id(*)
		def approve   
			render json: RealEstate.update_pending_status(params[:id], 0)
		end

	# / Pending

	# Manager

		# View
		def manager
			# Author
			authorize! :manage, RealEstate

			@res = RealEstate.manager_search_with_params interact: 'desc'

			render layout: 'layout_back'
		end

		# Partial view
		# params: keyword, page
		def _manager_list
			# Author
			return render json: { status: 6 } if cannot? :manage, RealEstate

			per = Rails.application.config.item_per_page

			params[:page] ||= 1
			params[:page] = params[:page].to_i

			res = RealEstate.manager_search_with_params params

			count = res.count

			return render json: { status: 1 } if count == 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'real_estates/manager_list', locals: { res: res.page(params[:page], per) }),
					pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per, page: params[:page] })
				}
			}
		end

		# Handle
		# params: id, is_force_hide
		def change_force_hide_status
			RealEstate.update_force_hide_status params[:id], params[:is_force_hide]

			render json: { status: 0 }
		end


		# Handle
		# params: id, is_favorite
		def change_favorite_status
			RealEstate.update_favorite_status params[:id], params[:is_favorite]

			render json: { status: 0 }
		end

	# / Manager

	# Appraise

		# View
		def appraise
			# Author
			return render json: { staus: 6 } if cannot? :appraise, RealEstate

			@res = RealEstate.where('appraisal_type <> 0 AND appraisal_price IS NULL').order(updated_at: 'asc')

			render layout: 'layout_back'
		end

		# Partial view
		def _appraise_list
			# Author
			return render json: { staus: 6 } if cannot? :appraise, RealEstate

			per = Rails.application.config.item_per_page

			if params[:keyword].blank?
				res = RealEstate.where('appraisal_type <> 0 AND appraisal_price IS NULL').order(updated_at: 'asc')
			else
				res = RealEstate.where('appraisal_type <> 0 AND appraisal_price IS NULL').search(params[:keyword])
			end

			count = res.count

			return render json: { status: 1 } if count == 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'real_estates/appraise_list', locals: { res: res.page(params[:page].to_i, per) }),
					pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per })
				}
			}
		end

		# Handle
		# params: id(*), ac_id(*)
		def set_appraisal_company
			result = AppraisalCompaniesRealEstate.assign params[:id], params[:ac_id]

			if result[:status] != 0
				render json: result
			else
				render json: { status: 0 }
			end
		end
		
	# / Appraise

	# Delete

		# Handle
		# params: id(*)
		def delete
			result = RealEstate.delete_by_id(params[:id])

			respond_to do |format|
				format.html { redirect_to '/' }
				format.json { render json: result }
			end
		end

	# / Delete

	# Search

		# Partial view
		# params: 
		# 	type
		#   per, page, price(x;y), real_estate_type, is_full, district
		#   newest, cheapest
		def search
			res = RealEstate.search_with_params params
			
			params[:per] ||= Rails.application.config.real_estate_item_per_page
			params[:per] = params[:per].to_i

			params[:type] ||= 1

			params[:page] ||= 1
			params[:page] = params[:page].to_i
			
			return render json: { status: 1 } if res.count == 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'real_estates/item_list', locals: { res: res.page(params[:page], params[:per]), type: params[:type] }),
					pagination: render_to_string(partial: 'shared/pagination_2', locals: { total: res.count, per: params[:per], page: params[:page] })
				}
			}
		end

	# / Search

	# Gallery

		# Handle
		# params: id
		def get_gallery
			images = RealEstateImage.where(real_estate_id: params[:id]).reorder('"order" asc')

			render json: { status: 0, result: images.map { |image| { id: image.id, small: image.image.url(:thumb), original: image.image.url, description: image.description } } }
		end

	# / Gallery

	# Favorite

		# Handle
		# params: id, is_add
		def user_favorite
			if params[:is_add] == '1'
				render json: UsersFavoriteRealEstate.add_favorite(params[:id])
			else
				render json: UsersFavoriteRealEstate.remove_favorite(params[:id])
			end
		end

	# / Favorite

end
