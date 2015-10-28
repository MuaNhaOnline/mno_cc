class BlocksController < ApplicationController
  
  # Partial view
  def _create
    render json: { status: 0, result: render_to_string(partial: 'blocks/create') }
  end

end