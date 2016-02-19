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

		private def get_search_param_from_keyword search
			case search

			when 'dat-tho-cu'
				{ search_name: 'Đất thổ cư', real_estate_type: 'residential_land' }
			when 'dat-nong-nghiep'
				{ search_name: 'Đất nông nghiệp', real_estate_type: 'vacant_land' }
			when 'dat-lam-nghiep'
				{ search_name: 'Đất lâm nghiệp', real_estate_type: 'forest_land' }
			when 'dat-san-xuat'
				{ search_name: 'Đất cho sản xuất', real_estate_type: 'productive_land' }
			when 'dat-du-an'
				{ search_name: 'Đất dự án', real_estate_type: 'project_land' }
			when 'van-phong'
				{ search_name: 'Văn phòng', real_estate_type: 'office' }
			when 'phong-tro'
				{ search_name: 'Phòng trọ', real_estate_type: 'motel' }
			when 'mat-bang-cua-hang'
				{ search_name: 'Mặt bằng - Cửa hàng', real_estate_type: 'store' }
			when 'nha-hang-khach-san'
				{ search_name: 'Nhà hàng - Khách sạn', real_estate_type: 'restaurant_hotel' }
			when 'nha-kho-xuong'
				{ search_name: 'Kho - Xưởng', real_estate_type: 'storage_workshop' }
			when 'can-ho-cao-cap'
				{ search_name: 'Căn hộ cao cấp', real_estate_type: 'high_apartment' }
			when 'can-ho-trung-binh'
				{ search_name: 'Căn hộ trung bình', real_estate_type: 'medium_apartment' }
			when 'can-ho-thap'
				{ search_name: 'Căn hộ thu nhập thấp', real_estate_type: 'low_apartment' }
			when 'nha-o-xa-hoi'
				{ search_name: 'Nhà ở xã hội', real_estate_type: 'social_home' }
			when 'biet-thu'
				{ search_name: 'Biệt thự', real_estate_type: 'villa' }
			when 'nha-pho'
				{ search_name: 'Nhà phố', real_estate_type: 'town_house' }

			when 'nha-tam'
				{ search_name: 'Nhà tạm', constructional_level: 'temporary' }

			when 'can-ho-co-ho-boi'
				{ search_name: 'Căn hộ có hồ bơi', real_estate_type: 'apartment', utilities: { pool: '' } }
			when 'nha-pho-duoi-1-ty' 
				{ search_name: 'Nhà phố dưới 1 tỷ', real_estate_type: 'town_house', price: '0;1000000000', }

			else
				{}
			end
		end

		# View
		# params: search params
		def list
			return redirect_to '/bat-dong-san' if params[:search].blank?

			@search_params = get_search_param_from_keyword(params[:search]) if params[:search].is_a? String

			@search_params[:is_full] = 'true'
			@full_res = RealEstate.search_with_params @search_params.clone

			@search_params[:is_full] = 'false'
			@short_res = RealEstate.search_with_params @search_params.clone
		end

		# Partial view
		# params: search params, page
		def _list_list
			params[:per] ||= 8
			params[:per] = params[:per].to_i

			params[:page] ||= 1
			params[:page] = params[:page].to_i

			params[:type] ||= 1
			params[:type] = params[:type].to_i

			res = RealEstate.search_with_params params[:search]

			count = res.count

			return render json: { status: 1 } if count == 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'real_estates/item_list', locals: { res: res.page(params[:page], params[:per]), type: params[:type] }),
					pagination: render_to_string(partial: 'shared/pagination_2', locals: { total: count, per: params[:per], page: params[:page] })
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
				session[:real_estate_viewed] << id
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

			if !signed? && params[:real_estate][:id].blank?
				RealEstateMailer.active(real_estate).deliver_later
			end

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
		# params: block_id(*), group_id(*)
		def _block_create
			@block = Block.find params[:block_id]
			@selected_group = BlockRealEstateGroup.find params[:group_id]
			@re = RealEstate.new

			render json: { status: 0, result: render_to_string(partial: 'real_estates/block_create') }
		end

		# Partial view
		# params: id(*)
		def _block_edit
			@re = RealEstate.find(params[:id])
			@selected_group = @re.block_group
			@block = @re.block

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

		# Handle
		# params: project_id(*), label(*), id
		def check_unique_label
			block_ids = Block.where(project_id: params[:project_id]).map{ |block| block.id }
			exist_re = RealEstate.where(block_id: block_ids, label: params[:label]).first

			if exist_re.present?
				if params[:id].present? && exist_re.id == params[:id].to_s
					render json: { status: 0, result: true }
				else
					render json: { status: 0, result: false }
				end
			else
				render json: { status: 0, result: true }
			end
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
		# return
			# {
			# 	images: [
			# 		{
			# 			id, 
			# 			url, 
			# 			thumb_url, 
			# 			descriptions: [
			# 				{
			# 					id,
			# 					tag_name,
			# 					points (if polyline)
			# 					description: {
			# 						type,
			# 						data (if text_image): {
			# 							description,
			# 							images: [
			# 								{
			# 									id,
			# 									url,
			# 									description,
			# 									is_avatar
			# 								}
			# 							]
			# 						}
			# 					}
			# 				}
			# 			]
			# 		}
			# 	]
			# }
		def groups_get_image_for_interact_build
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
						description = { id: image_description.id, tag_name: image_description.area_type }

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
		def groups_get_data_for_interact_view

			@group = BlockRealEstateGroup.find params[:id]

			# Images

				# Result for request
				images = []

				# Get group's image
				real_estate_group_images = BlockRealEstateGroupImage.where(block_real_estate_group_id: params[:id])

				# Get all info of each image
				real_estate_group_images.each do |real_estate_group_image|
					image = {}

					# Get url for display
					image[:url] = real_estate_group_image.image.url

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

			# / Images

			# Info

				info = render_to_string(partial: 'real_estates/groups/info_for_interact_view')

			# / Info

			# Navigator
			
				navigator = {
					block: {
						id: @group.block.id,
						name: @group.block.name
					},
					group: {
						id: @group.id,
						name: @group.name
					}
				}
			
			# / Navigator

			render json: { 
				status: 0, 
				result: {
					images: images,
					info: info,
					navigator: navigator
				} 
			}
		end

		# Get values
		# params: id(*)(block_id)
		def groups_get_options_for_interact_view
			groups = BlockRealEstateGroup.where block_id: params[:id]

			options = []
			groups.each do |group|
				floor_ids = '|' + group.real_estates.group_by{ |re| re.block_floor_id }.keys.join('|') + '|'
				options << {
					id: group.id,
					name: group.name,
					floor_ids: floor_ids
				}
			end

			render json: { status: 0, result: options }
		end

		# Get values
		# params: id(*)
		def get_data_for_interact_view

			@re = RealEstate.find params[:id]

			# Images

				# Result for request
				images = []

				# Surface
				
					# Get all info of surface
					image = {}

					# Get url for display
					image[:url] = @re.block_floor.surface.url

					if @re.block_floor.surface_descriptions.present?
						image[:descriptions] = []

						@re.block_floor.surface_descriptions.each do |surface_description|
							description = { tag_name: surface_description.area_type }

							# Area info
							case surface_description.area_type
							when 'polyline'
								description[:points] = surface_description.area_info['points']
							else
								next
							end

							# Description info
							description[:description] = { type: surface_description.description_type }
							case surface_description.description_type
							when 'real_estate'
								description[:description][:id] = surface_description.real_estate_description.real_estate_id

								# Detect position
								if @position.real_estate.id == surface_description.real_estate_description.real_estate_id
									description[:status] = 'highlight'
								end
							when 'text_image'
								description[:description][:data] = {}
								if surface_description.text_description.present?
									description[:description][:data][:description] = surface_description.text_description.description
								end

								if surface_description.image_descriptions.present?
									image_data = []
									surface_description.image_descriptions.each do |data|
										image_data << { id: data.id, url: data.image.url, description: data.description, is_avatar: data.is_avatar }
									end
									description[:description][:data][:images] = image_data.to_json
								end
							end

							image[:descriptions] << description
						end
					end

					images << image
				
				# / Surface

				# Group image
				
					@re.block_group.images.each do |real_estate_group_image|
						image = {}

						# Get url for display
						image[:id] = real_estate_group_image.id
						image[:url] = real_estate_group_image.image.url
						image[:thumb_url] = real_estate_group_image.image.url('thumb')

						if real_estate_group_image.image_descriptions.present?
							image[:descriptions] = []

							real_estate_group_image.image_descriptions.each do |image_description|
								description = { id: image_description.id, tag_name: image_description.area_type }

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
				
				# / Group image

			# / Images

			# Info

				info = render_to_string(partial: 'real_estates/info_for_interact_view')

			# / Info

			# Navigator
			
				navigator = {
					block: {
						id: @re.block.id,
						name: @re.block.name
					},
					group: {
						id: @re.block_group.id,
						name: @re.block_group.name
					},
					floor: {
						id: @re.block_floor.id,
						name: "#{@re.block_floor.floors_text}: #{@re.block_floor.name}"
					},
					real_estate: {
						id: @re.id,
						name: @re.short_label
					}
				}
			
			# / Navigator

			render json: { 
				status: 0, 
				result: {
					images: images,
					info: info,
					navigator: navigator
				} 
			}
		end

		# Get values
		# params: id(*)(block_id)
		def get_options_for_interact_view
			res = RealEstate.where block_id: params[:id]

			options = []
			res.each do |re|
				options << {
					id: re.id,
					name: re.short_label,
					group_id: re.block_real_estate_group_id,
					floor_id: re.block_floor_id
				}
			end

			render json: { status: 0, result: options }
		end

		# Get values
		# params: id(*)(floor_real_estate_id)
		def floors_get_data_for_interact_view

			@position = FloorRealEstate.find params[:id]

			# Images

				images = []

				# Surface
				
					# Get all info of surface
					image = {}

					# Get url for display
					image[:url] = @position.real_estate.block_floor.surface.url

					if @position.real_estate.block_floor.surface_descriptions.present?
						image[:descriptions] = []

						@position.real_estate.block_floor.surface_descriptions.each do |surface_description|
							description = { tag_name: surface_description.area_type }

							# Area info
							case surface_description.area_type
							when 'polyline'
								description[:points] = surface_description.area_info['points']
							else
								next
							end

							# Description info
							description[:description] = { type: surface_description.description_type }
							case surface_description.description_type
							when 'real_estate'
								description[:description][:id] = surface_description.real_estate_description.real_estate_id

								# Detect position
								if @position.real_estate.id == surface_description.real_estate_description.real_estate_id
									description[:status] = 'highlight'
								end
							when 'text_image'
								description[:description][:data] = {}
								if surface_description.text_description.present?
									description[:description][:data][:description] = surface_description.text_description.description
								end

								if surface_description.image_descriptions.present?
									image_data = []
									surface_description.image_descriptions.each do |data|
										image_data << { id: data.id, url: data.image.url, description: data.description, is_avatar: data.is_avatar }
									end
									description[:description][:data][:images] = image_data.to_json
								end
							end

							image[:descriptions] << description
						end
					end

					images << image
				
				# / Surface

				# Group image
				
					@position.real_estate.block_group.images.each do |real_estate_group_image|
						image = {}

						# Get url for display
						image[:id] = real_estate_group_image.id
						image[:url] = real_estate_group_image.image.url
						image[:thumb_url] = real_estate_group_image.image.url('thumb')

						if real_estate_group_image.image_descriptions.present?
							image[:descriptions] = []

							real_estate_group_image.image_descriptions.each do |image_description|
								description = { id: image_description.id, tag_name: image_description.area_type }

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
				
				# / Group image

			# / Images

			# Info

				info = render_to_string(partial: 'real_estates/floors/info_for_interact_view')

			# / Info

			# Navigator
			
				navigator = {
					block: {
						id: @position.real_estate.block.id,
						name: @position.real_estate.block.name
					},
					group: {
						id: @position.real_estate.block_group.id,
						name: @position.real_estate.block_group.name
					},
					floor: {
						id: @position.real_estate.block_floor.id,
						name: "#{@position.real_estate.block_floor.floors_text}: #{@position.real_estate.block_floor.name}"
					},
					real_estate: {
						id: @position.real_estate.id,
						name: @position.real_estate.short_label
					},
					position: {
						id: @position.id,
						name: "Tầng #{@position.floor}: #{@position.label}"
					}
				}
			
			# / Navigator

			render json: { 
				status: 0, 
				result: {
					images: images,
					info: info,
					navigator: navigator
				} 
			}
		end

		# Get values
		# params: id(*)
		def floors_get_options_for_interact_view
			re_floors = FloorRealEstate.where real_estate_id: params[:id]

			options = []
			re_floors.each do |re_floor|
				options << {
					id: re_floor.id,
					name: "Tầng #{re_floor.floor}: #{re_floor.label}"
				}
			end

			render json: { status: 0, result: options }
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

		def set_owner_info
			RealEstate.set_owner_info params[:owner_info]

			render json: { status: 0 }
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

	# Zoho
	
		def zoho_sync

			RealEstate.zoho_sync

			render text: 'OK'

		end
	
	# / Zoho

end
