class ProjectsController < ApplicationController
	layout 'layout_front'

	# Index

		# View
		def index
			@projects = Project.where(is_draft: 0, is_show: 1).limit(6)
		end

		def demo
		end

	# / Index

	# View

		# View
		# params: slug(*)
		def view
			id = params[:slug][((params[:slug].rindex('-') || -1) + 1)...params[:slug].length]

			@project = Project.find id

			session[:project_viewed] ||= []
			unless session[:project_viewed].include? id
				@project.update(view_count: @project.view_count + 1)
				session[:project_viewed] << id
			end
		end

		# View
		# params: id(*)
		def view_2
			@project = Project.find params[:id]

			render layout: nil
		end

	# / View

	# Create

		# View
		# params: id
		def create
			if params.has_key? :id
				begin
					@p = Project.find params[:id]
				rescue
					@p = Project.new
				end
			else
				@p = Project.new
			end
			
			# Author
			if @p.new_record?
				authorize! :create, Project
			else
				authorize! :edit, @p
			end

			render layout: 'layout_back'
		end

		# Handle => View
		# params: id(*), is_full(*)
		def set_is_full_status
			is_full = params[:is_full] == '1'
			Project.where(id: params[:id]).update_all(is_full: is_full, is_draft: is_full)

			if is_full
				redirect_to "/du-an/create_details/#{params[:id]}"
			else
				redirect_to '/du-an/cua-toi'
			end
		end

		# Handle => View
		# params: id(*), is_full(*)
		def set_finished_status
			# Project.where(id: params[:id]).update_all(is_draft: false)

			project = Project.find params[:id]
			

			redirect_to "/du-an/cua-toi"
		end

		# Handle
		# params: project form
		def save
			is_draft = params.has_key? :draft

			if params[:project][:id].blank?
				params[:project][:user_id] = current_user.id
				project = Project.new
			else 
				project = Project.find(params[:project][:id])
				if project.nil?
					return render json: { status: 1 }
				end
			end

			result = project.save_with_params(params[:project], is_draft)

			return render json: result if result[:status] != 0

			render json: { status: 0, result: project.id }
		end

		# View
		# params: id
		def create_details
			@project = Project.find params[:id]
			
			render layout: 'layout_back'
		end

		# View
		# params: id(*)
		def setup_interact_images
			@project = Project.find params[:id]

			render layout: 'layout_back'
		end

		# Handle
		# params: id(*)
		# return
			# errors: [
			# 	{
			# 		type: enum(project, block, surface),
			# 		id,
			#		alert
			# 	}
			# ]
		def setup_interact_images_finish
			project = Project.find params[:id]
			errors = []

			# Check block (project image must point to all blocks)
			project.blocks.each do |block|
				unless ProjectImageBlockDescription.exists? block_id: block.id
					errors << {
						type: 'project',
						name: block.name,
						id: ''
					}
				end

				# Check block floor (block image must point to all block floors)
				block.floors.each do |floor|
					unless BlockImageBlockFloorDescription.exists? block_floor_id: floor.id
						errors << {
							type: 'block',
							id: block.id,
							name: floor.name
						}
					end
				end

				# Check real-estate (block floor image must point to all real-estates)
				block.real_estates.each do |re|
					unless BlockFloorSurfaceRealEstateDescription.exists? real_estate_id: re.id
						errors << {
							type: 'surface',
							id: block.id,
							name: re.label
						}
					end
				end
			end

			render json: { status: 0, result: errors }
		end

	# / Create

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
			# 						id (if block),
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
		def get_image_for_interact_build
			# Result for request
			images = []

			# Get project's image
			project_images = ProjectImage.where(project_id: params[:id])

			# Get all info of each image
			project_images.each do |project_image|
				image = {}

				# Get url for display
				image[:id] = project_image.id
				image[:url] = project_image.image.url
				image[:thumb_url] = project_image.image.url('thumb')

				if project_image.image_descriptions.present?
					image[:descriptions] = []

					project_image.image_descriptions.each do |image_description|
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
						when 'block'
							description[:description][:id] = image_description.block_description.block_id
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
			render json: ProjectImage.save_description(JSON.parse(params[:data]))
		end

		# Get values
		# params: id(*)
		def get_data_for_interact_view

			@project = Project.find params[:id]

			# Images

				# Result for request
				images = []

				# Get project's image
				project_images = ProjectImage.where(project_id: params[:id])

				# Get all info of each image
				project_images.each do |project_image|
					image = {}

					# Get url for display
					image[:url] = project_image.image.url

					if project_image.image_descriptions.present?
						image[:descriptions] = []

						project_image.image_descriptions.each do |image_description|
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
							when 'block'
								description[:description][:id] = image_description.block_description.block_id
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

				info = render_to_string(partial: 'projects/info_for_interact_view')

			# / Info

			render json: { 
				status: 0, 
				result: {
					images: images,
					info: info,
					navigator: {}
				} 
			}
		end

	# / Interact image

	# My list

		# View
		def my
			# Author
			authorize! :view_my, Project

			@projects = Project.my_search_with_params interact: 'desc'

			render layout: 'layout_back'
		end

		# Partial view
		# params: keyword
		def _my_list
			# Author
			return render json: { status: 6 } if cannot? :view_my, Project

			per = Rails.application.config.item_per_page
			
			params[:page] ||= 1
			params[:page] = params[:page].to_i

			projects = Project.my_search_with_params params

			count = projects.count

			return render json: { status: 1 } if count === 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'projects/my_list', locals: { projects: projects.page(params[:page], per) }),
					pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per, page: params[:page] })
				}
			}
		end

		def change_show_status
			Project.update_show_status params[:id], params[:is_show]

			render json: { status: 0 }
		end

	# / My list

	# My favorite list

		# View
		def my_favorite
			# Author
			authorize! :view_my_favorite, Project

			@projects = Project.my_favorite_search_with_params interact: 'desc'

			render layout: 'layout_back'
		end

		# Partial view
		# params: keyword, page
		def _my_favorite_list
			# Author
			return render json: { status: 6 } if cannot? :view_my_favorite, Project

			per = Rails.application.config.item_per_page

			params[:page] ||= 1
			params[:page] = params[:page].to_i

			projects = Project.my_favorite_search_with_params params

			count = projects.count

			return render json: { status: 1 } if count === 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'projects/my_favorite_list', locals: { projects: projects.page(params[:page], per) }),
					pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per, page: params[:page] })
				}
			}
		end

	# / My favorite list

	# Pending

		# View
		def pending
			# Author
			authorize! :manage, Project

			@projects = Project.pending_search_with_params interact: 'desc'

			render layout: 'layout_back'
		end

		# Partial view
		# params: keyword
		def _pending_list
			# Author
			return render json: { staus: 6 } if cannot? :manage, Project

			per = Rails.application.config.item_per_page
			
			params[:page] ||= 1
			params[:page] = params[:page].to_i

			ps = Project.pending_search_with_params params

			count = ps.count

			return render json: { status: 1 } if count === 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'projects/pending_list', locals: { projects: ps.page(params[:page], per) }),
					pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per, page: params[:page] })
				}
			}
		end

		# Handle
		# params: id(*)
		def approve   
			render json: Project.update_pending_status(params[:id], 0)
		end

	# / Pending

	# Manager

		def manager
			# Author
			authorize! :manage, Project

			@projects = Project.manager_search_with_params interact: 'desc'

			render layout: 'layout_back'
		end

		# Partial view
		# params: keyword, page
		def _manager_list
			# Author
			return render json: { status: 6 } if cannot? :manage, Project

			per = Rails.application.config.item_per_page

			params[:page] ||= 1
			params[:page] = params[:page].to_i

			projects = Project.manager_search_with_params params

			count = projects.count

			return render json: { status: 1 } if count == 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'projects/manager_list', locals: { projects: projects.page(params[:page], per) }),
					pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per, page: params[:page] })
				}
			}
		end

		# Handle
		# params: id, is_force_hide
		def change_force_hide_status
			Project.update_force_hide_status params[:id], params[:is_force_hide]

			render json: { status: 0 }
		end


		# Handle
		# params: id, is_favorite
		def change_favorite_status
			Project.update_favorite_status params[:id], params[:is_favorite]

			render json: { status: 0 }
		end

	# / Manager

	# Delete

		# Handle
		# params: id(*)
		def delete
			render json: Project.delete_by_id(params[:id])
		end

	# / Delete

	# Search

		# Partial view
		# params: 
		#   list_type, per, price(x;y), page, district
		#   newest
		def search
			projects = Project.search_with_params params
			
			params[:per] ||= Rails.application.config.real_estate_item_per_page
			params[:per] = params[:per].to_i

			params[:page] ||= 1
			params[:page] = params[:page].to_i

			return render json: { status: 1 } if projects.count == 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'projects/item_list', locals: { projects: projects.page(params[:page], params[:per]), type: params[:list_type].to_i }),
					pagination: render_to_string(partial: 'shared/pagination_2', locals: { total: projects.count, per: params[:per], page: params[:page] })
				}
			}
		end

	# / Search

	# Gallery

		# Handle
		# params: id
		def get_gallery
			images = ProjectImage.where(project_id: params[:id]).reorder('"order" asc')

			render json: { status: 0, result: images.map { |image| { id: image.id, small: image.image.url(:thumb), original: image.image.url, description: image.description } } }
		end

	# / Gallery

	# Favorite

		# Handle
		# params: id, is_add
		def user_favorite
			if params[:is_add] == '1'
				render json: UsersFavoriteProject.add_favorite(params[:id])
			else
				render json: UsersFavoriteProject.remove_favorite(params[:id])
			end
		end

	# / Favorite

end
