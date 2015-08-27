class UsersController < ApplicationController
	layout 'layout_back'
  skip_before_filter :verify_authenticity_token

# Sign up
  
  # View
  def create
    if (params.has_key?(:id))
      begin
        @user = User.find(params[:id])
      rescue
        @user = User.new
      end
    else
      @user = User.new
    end
    
    # Author
    if @user.new_record?
      authorize! :signup, nil
    else  
      authorize! :edit, @user
    end
  end

  # Handle
  # params: form user
  def save
    if params[:user][:id].blank?
      user = User.new
    else 
      user = User.find(params[:user][:id])
      if user.nil?
        return render json: { status: 1 }
      end
    end

    result = user.save_with_params params[:user]

    return render json: result if result[:status] != 0

    if user.errors.any?
      render json: { status: 3, result: user.errors.full_messages }
    else
      render json: { status: 0, result: user.id }
    end
  end

  # Handle
  # params: account(*)
  def check_unique_account
    render json: { status: 0, result: !User.exists?(account: params[:account]) }
  end

  # Handle
  # params: email(*)
  def check_unique_email
    render json: { status: 0, result: !User.exists?(email: params[:email]) }
  end

# / Sign up

# Sign in, out

  # View
  def signin
    # Author
    authorize! :signin, nil
  end

  # Handle
  # params: user form: account(*), password(*), remember
  def signin_handle
    result = User.check_signin params[:user][:account], params[:user][:password]

    # Return if not correct
    if result[:status] != 0
      return redirect_to '/' if result[:status] === 6
      return respond_to do |format|
        format.html { render 'users/signin', locals: { error: result[:result][:result] } }
        format.json { render json: result }
      end
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

    render json: 
    respond_to do |format|
        format.html { redirect_to '/' }
        format.json { render json: { status: 0, result: user.id } }
      end
  end

  # Handle
  def signout
    session[:user_id] = nil
    cookies.delete :user_account
    cookies.delete :user_password

    redirect_to '/'
  end

  # Facebook signin
  
  def facebook_signin
    return render json: request.env['omniauth.auth']
    user = User.from_omniauth request.env['omniauth.auth']
    session[:user_id] = user.id
    redirect_to 'home/back'
  end

  # / Facebook signin

# / Sign in, out

# Manager

  # View
  def manager
    # Author
    authorize! :manage, user

    @system_managers = User.search_by_type '', 'system_manager', true
    @user_managers = User.search_by_type '', 'user_manager', true
    @real_estate_managers = User.search_by_type '', 'real_estate_manager', true
    @project_managers = User.search_by_type '', 'project_manager', true
    @appraisers = User.search_by_type '', 'appraiser', true
    @statisticians = User.search_by_type '', 'statistician', true
  end

  # Partial view
  # params: is_add(*), type(*), page, keyword
  def _manager_list
    # Author
    return render json: { status: 6 } if cannot? :manage, User
    
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
    render json: User.update_type_by_id(params[:id], params[:type], params[:is])
  end

# / Manager

# View

  # View
  # params: id(*)
  def view
    begin
      @user = User.find(params[:id])
    rescue
      redirect_to '/'
    end    
  end

# / View

# Autocomplete

  def autocomplete
    users = User.search(params[:keyword]).limit(10)

    list = []
    users.each do |user|
      list << { value: user.id, text: user.full_name }
    end

    render json: { status: 0, result: list }
  end

# / Autocomplete

end