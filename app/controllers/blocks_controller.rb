class BlocksController < ApplicationController
  skip_before_filter :verify_authenticity_token, :only => [:save, :save_building]

  def create
    @project_id = params[:project_id]
  
    render json: Hash[status: 1, result: render_to_string(partial: '/blocks/create')]
  end
  
  def save
    block = Block.save_block params['block']
  
    if block.errors.any?
      render json: Hash[status: 0, result: block.errors.full_messages]
    else
      render json: Hash[status: 1, result: block]
    end
  end 

  def build
    @block = Block.find params[:id]

    render json: Hash[status: 1, result: render_to_string(partial: '/blocks/build')]
  end

  def save_building
    Block.update_building params.permit(:id, :floor_number, :items_list, :items_list_existed)

    render nothing: true
  end
end