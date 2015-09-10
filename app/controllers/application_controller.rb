=begin
  status
    0: Success
    1: No result
    2: Hanlde error
    3: Constraint error
    4: Need sign in
    5: Error of business
    6: Permission
=end

class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  
  skip_before_filter :verify_authenticity_token

  before_action :get_current_user, :init, :set_locale
  helper_method :signed?, :current_user

  rescue_from CanCan::AccessDenied do |e|
    redirect_to '/'
  end

  def init
    @current_ability = User.ability = Ability.new(current_user, request)
  end
 
	def set_locale
		# begin
  #     if (false && cookies.has_key?('locale'))
  #       I18n.locale = cookies[:locale]
  #     else 
  # 	  	I18n.locale = cookies[:locale] = params[:l] || I18n.default_locale
  #     end
  #   rescue
	 #  	I18n.locale = cookies[:locale] = I18n.default_locale
  #   end
	end

  private
  def get_current_user
    # if exists session user_id
    unless session[:user_id].nil?
      u = User.find_by id: session[:user_id]
      unless u.nil?
        User.current = @current_user = u
        return
      end
    end

    # if exists cookie user_account
    if cookies.has_key? :user_account
      result = User.check_signin_without_encode cookies[:user_account], cookies[:user_password]
      
      if result[:status] == 0
        User.current = @current_user = result[:result]
        session[:user_id] = result[:result].id
        return
      end
    end

    session[:user_id] = nil
    return User.current = @current_user = User.new
  end

  def signed?
    !session[:user_id].nil?
  end

  def current_user
    @current_user
  end

  def current_ability
    @current_ability # Always have (run in before_action (init))
  end
end