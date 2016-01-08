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

	# Block list

		# Partial view
		# params: project_id(*)
		def _description_item_list
			blocks = Block.where project_id: params[:project_id]

			render json: {
				status: 0,
				result: render_to_string(partial: 'blocks/description_item_list', locals: { blocks: blocks })
			}
		end

	# / Block list

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

					render json: { 
						status: 0, 
						result: {
							images: images 
						} 
					}
				end

		# / Block

		# Floor

			# Get values
			# params: id(*)
			def floor_get_image_for_interact_build
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
				end

				render json: { status: 0, result: images }
			end

			# Handle
			# params: data(*)
			def floor_save_interact_images
				render json: BlockFloor.save_description(JSON.parse(params[:data]))
			end

			# Get values
			# params: id(*)
			def floor_get_data_for_interact_view

				# Images

					# Result for request
					images = []

					# Get block's image
					floors = BlockFloor.where(block_id: params[:id])

					# Get all info of each image
					floors.each do |floor|
						image = {}

						# Get url for display
						image[:url] = floor.surface.url

						if floor.surface_descriptions.present?
							image[:descriptions] = []

							floor.surface_descriptions.each do |surface_description|
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
					end

				# / Images

				render json: { 
					status: 0, 
					result: {
						images: images 
					} 
				}
			end

		# / Floor

	# / Interact image

end