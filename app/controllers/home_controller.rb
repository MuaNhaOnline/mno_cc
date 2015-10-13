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
    @all = Session.all
    @online_users = []
    @online_guess_count = 0
    @day_count = 0
    @month_count = 0
    @year_count = 0
    @in_day_users = []

    @all.each do |s|
      if s.updated_at > 15.minutes.ago
        if s.data['user_id'].present?
          @online_users << s.data['user_id']
        else
          @online_guess_count += 1
        end
      end

      if s.updated_at.year == Date.current.year
        @year_count += 1
        if s.updated_at.month == Date.current.month
          @month_count += 1
          if s.updated_at.day == Date.current.day
            @day_count += 1
            if s.data['user_id'].present?
              @in_day_users << s.data['user_id']
            end
          end
        end
      end
    end

    @online_users = @online_users.uniq
    @in_day_users = @in_day_users.uniq

    @online_users = User.find @online_users
    @in_day_users = User.find @in_day_users

    render layout: 'layout_back'
  end

  # Handle
  def nothing
    render plain: '0'
  end
end