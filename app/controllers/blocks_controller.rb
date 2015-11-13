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

	# Build interact image

		# Get values
		# params: id(*)
		def get_image_for_interact_build
			# Result for request
			images = []

			# Get block's image
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
						when 'block'
							description[:description][:id] = image_description.block_description.block_id
						when 'real_estate'
							description[:description][:id] = image_description.real_estate_description.real_estate_id
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

	# / Build interact image

end