class HomeController < ApplicationController
	layout 'layout_front'
  def index
    	
  end
  
  def back
  	render layout: 'layout_back'
  end

  # Handle
  # params: width_type
  def set_width
  	cookies[:width_type] = params[:width_type]
  	render plain: '0'
  end

  # Handle
  def nothing
    render plain: '0'
  end

  # Handle
  def end_session
    current_user.update(is_online: false) if signed?
    render plain: '0'
  end
end