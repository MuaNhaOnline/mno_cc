class BlocksController < ApplicationController

	# Create
	
		# Partial view
		# params: project_id(*), id
		def _create
			@project = Project.find params[:project_id]

			@block = params[:id].present? ? Block.find(params[:id]) : Block.new

			render json: { status: 0, result: render_to_string(partial: 'blocks/create') }
		end

		# Handle
		def save
			block = params[:block][:id].present? ? Block.find(params[:block][:id]) : Block.new

			result = block.save_with_params params[:block]

			if result[:status] != 0
				render json: { status: 2 }
			else
				render json: { status: 0, result: render_to_string(partial: 'blocks/item_list', locals: { blocks: [ block ] }) }
			end
		end

	# / Create

	# Description list

		# Partial view
		# params: project_id(*)
		def _description_item_list
			blocks = Block.where project_id: params[:project_id]

			render json: {
				status: 0,
				result: render_to_string(partial: 'blocks/description_item_list', locals: { blocks: blocks })
			}
		end

		# Partial view
		# params: block_id(*)
		def _floors_description_item_list
			block_floors = BlockFloor.where block_id: params[:block_id]

			render json: {
				status: 0,
				result: render_to_string(partial: 'blocks/floors/description_item_list', locals: { block_floors: block_floors })
			}
		end

	# / Description list

	# Delete

		# Handle
		# params: id(*)
		def delete
			result = Block.delete_by_id params[:id]

			render json: result
		end

	# / Delete

	# Interact image

		# Block

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
				# 						id (if real_estate, block_floor),
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
				block_images = BlockImage.where(block_id: params[:id])

				# Get all info of each image
				block_images.each do |block_image|
					image = {}

					# Get url for display
					image[:id] = block_image.id
					image[:url] = block_image.image.url
					image[:thumb_url] = block_image.image.url('thumb')

					if block_image.image_descriptions.present?
						image[:descriptions] = []

						block_image.image_descriptions.each do |image_description|
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
							when 'real_estate'
								description[:description][:id] = image_description.real_estate_description.real_estate_id
							when 'block_floor'
								description[:description][:id] = image_description.block_floor_description.block_floor_id
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
				render json: BlockImage.save_description(JSON.parse(params[:data]))
			end

			# Get values
			# params: id(*)
			def get_data_for_interact_view

				@block = Block.find params[:id]

				# Images

					# Result for request
					images = []

					# Get project's image
					block_images = BlockImage.where(block_id: params[:id])

					# Get all info of each image
					block_images.each do |block_image|
						image = {}

						# Get url for display
						image[:url] = block_image.image.url

						if block_image.image_descriptions.present?
							image[:descriptions] = []

							block_image.image_descriptions.each do |image_description|
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
								when 'real_estate'
									description[:description][:id] = image_description.real_estate_description.real_estate_id
								when 'block_floor'
									description[:description][:id] = image_description.block_floor_description.block_floor_id
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

					info = render_to_string(partial: 'blocks/info_for_interact_view')

				# / Info

				# Navigator
				
					navigator = {
						block: {
							id: @block.id,
							name: @block.display_name
						}
					}

					if @block.block_type.present?
						if (!@block.has_floor && @block.floors.present?)
							navigator[:floor] = {
								id: @block.floors.first.id,
								name: @block.floors.first.display_name
							}
							navigator[:display_position] = false
						end
					end
				
				# / Navigator

				render json: { 
					status: 0, 
					result: {
						images: images,
						info: info,
						navigator: navigator,
						has_floor: @block.has_floor
					} 
				}
			end

			# Get values
			# params: id(*)(project_id)
			def get_options_for_interact_view
				blocks = Block.where project_id: params[:id]

				options = []
				blocks.each do |block|
					options << {
						id: block.id,
						name: block.display_name
					}
				end

				render json: { status: 0, result: options }
			end

		# / Block

		# Floor

			# Get values
			# params: id(*)(block id)
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
				# 						id (if real_estate),
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
			def floors_get_image_for_interact_build
				# Result for request
				images = []

				# Get block's image
				floors = BlockFloor.where(block_id: params[:id])

				# Get all info of each image
				floors.each do |floor|
					image = {}

					# Get url for display
					image[:id] = floor.id
					image[:url] = floor.surface.url
					image[:thumb_url] = floor.surface.url('thumb')

					if floor.surface_descriptions.present?
						image[:descriptions] = []

						floor.surface_descriptions.each do |surface_description|
							description = { id: surface_description.id, tag_name: surface_description.area_type }

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
				end

				render json: { status: 0, result: images }
			end

			# Handle
			# params: data(*)
			def floors_save_interact_images
				render json: BlockFloor.save_description(JSON.parse(params[:data]))
			end

			# Get values
			# params: id(*)(floor id)
			def floors_get_data_for_interact_view

				@floor = BlockFloor.find params[:id]

				# Images

					# Result for request
					images = []

					# Get all info of image
					image = {}

					# Get url for display
					image[:url] = @floor.surface.url

					if @floor.surface_descriptions.present?
						image[:descriptions] = []

						@floor.surface_descriptions.each do |surface_description|
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

				# / Images

				# Info

					info = render_to_string(partial: '/blocks/floors/info_for_interact_view')

				# / Info

				# Navigator
				
					navigator = {
						block: {
							id: @floor.block.id,
							name: @floor.block.display_name
						},
						floor: {
							id: @floor.id,
							name: @floor.display_name
						}
					}

					if @floor.block.block_type.present?
						unless @floor.block.has_floor
							navigator[:display_position] = false
						end
					end
				
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
			def floors_get_options_for_interact_view
				floors = BlockFloor.where block_id: params[:id]

				options = []
				floors.each do |floor|
					group_ids = '|' + floor.real_estates.group_by{ |re| re.block_real_estate_group_id }.keys.join('|') + '|'
					options << {
						id: floor.id,
						name: floor.display_name,
						group_ids: group_ids
					}
				end

				render json: { status: 0, result: options }
			end

		# / Floor

	# / Interact image

end