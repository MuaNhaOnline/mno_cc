class UsersController < ApplicationController
	layout 'layout_back'
  skip_before_filter :verify_authenticity_token

# Sign up
  
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

# / Sign up

# Sign in

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

# / Sign in

# Manager

  def manager
    @system_managers = User.search_by_type '', 'system_manager', true
    @user_managers = User.search_by_type '', 'user_manager', true
    @real_estate_managers = User.search_by_type '', 'real_estate_manager', true
    @project_managers = User.search_by_type '', 'project_manager', true
    @appraisers = User.search_by_type '', 'appraiser', true
    @statisticians = User.search_by_type '', 'statistician', true
  end

  # params: is_add(*), type(*), page, keyword
  def _manager_list
    # Check unless exists is_add, type
    return render json: { status: 3 } unless params.has_key?(:is_add) && params.has_key?(:type)

    per = Rails.application.config.item_per_page
    page = params.has_key?(:page) ? params[:page].to_i : 1
    is_add = params[:is_add] === 'true'
    type = params[:type]

    users = User.search_by_type params[:keyword], type, !is_add

    count = users.count

    return render json: { status: 1 } if count === 0

    render json: {
      status: 0,
      result: {
        list: render_to_string(partial: 'users/manager_list', locals: { users: users.page(page, per), is_add: is_add }),
        pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per })
      }
    }
  end

  # params: id(*), type(*), is(*)
  def change_type
    User.update_type_by_id params[:id], params[:type], params[:is]

    render json: { status: 0 }
  end

# / Manager

end