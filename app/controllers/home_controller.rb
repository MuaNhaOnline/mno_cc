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

  # View
  def online_counter
    sessions = Session.where('updated_at > ?', 15.minutes.ago)
    @all = Session.count
    @users = []
    @guess = 0

    sessions.each do |s|
      if s.data['user_id'].present?
        @users << User.where(id: s.data['user_id']).first
      else
        @guess += 1
      end
    end

    render layout: 'layout_back'
  end

  # Handle
  def nothing
    render plain: '0'
  end
end