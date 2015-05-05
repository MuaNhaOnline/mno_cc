class ItemGroupsController < ApplicationController
  skip_before_filter :verify_authenticity_token, :only => [:save]
  
  def create
  	@block_id = params[:block_id]
  	
    render json: Hash[status: 1, result: render_to_string(partial: '/item_groups/create')]
  end

  def save
    item_group = ItemGroup.save_item_group params['item_group']
  
    if item_group.errors.any?
      render json: Hash[status: 0, result: item_group.errors.full_messages]
    else
      render json: Hash[status: 1, result: item_group]
    end
  end
end
