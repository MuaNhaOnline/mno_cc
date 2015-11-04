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

	# Delete

	  # Handle
	  # params: id(*)
	  def delete
	    result = Block.delete_by_id params[:id]

      render json: result
	  end

	# / Delete

end