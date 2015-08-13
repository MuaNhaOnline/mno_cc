class UsersController < ApplicationController
	layout 'layout_back'
  skip_before_filter :verify_authenticity_token
  
  def create
  	
  end

  def save
    user = User.new

    user.save_with_params params[:user]

    if user.errors.any?
      render json: { status: 3, result: user.errors.full_messages }
    else
      render json: { status: 0, result: user.id }
    end
  end

  def check_unique_account
    begin
      render json: { status: 0, result: !User.exists?(account: params[:account]) }
    rescue 
      render json: { status: 2 }
    end
  end

  def check_unique_email
    begin
      render json: { status: 0, result: !User.exists?(email: params[:email]) }
    rescue 
      render json: { status: 2 }
    end
  end

  def signin
    
  end

  def signin_handle
    result = User.check_signin params[:user][:account], params[:user][:password]

    # Return if not correct
    if result[:status] != 0
      return render json: result
    end

    user = result[:result]

    # Store id into session
    session[:user_id] = user.id

    # Store account, password into cookie
    if params.has_key? :remember
      expires = 15.days.from_now
      cookies[:user_account] = {
        value: user.account,
        expires: expires
      }
      cookies[:user_password] = {
        value: user.password,
        expires: expires
      }
    else
      cookies.delete :user_account
      cookies.delete :user_password
    end

    render json: { status: 0, result: user.id }
  end

  def manager
    @users = User.all
  end

  def _manager_list
    # per = Rails.application.config.item_per_page

    # if params[:keyword].blank?
    #   res = User.order(updated_at: 'desc')
    # else
    #   res = User.search(params[:keyword]).order(updated_at: 'desc')
    # end

    # count = res.count

    # return render json: { status: 1 } if count === 0

    # render json: {
    #   status: 0,
    #   result: {
    #     list: render_to_string(partial: 'real_estates/manager_list', locals: { res: res.page(params[:page].to_i, per) }),
    #     pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per })
    #   }
    # }
  end
end