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

	before_action :init
	helper_method :signed?, :current_user, :current_purpose, :current_width_type

	rescue_from CanCan::AccessDenied do |e|
		redirect_to '/'
	end

	def init
		unless cookies.has_key? :width_type
			if params.has_key? :width_type
				cookies[:width_type] = params[:width_type]
  			render plain: '0'
  		else
				@location = request.path
				render 'home/get_width', layout: false
			end
			return
		end

		User.options = {}

		@current_user = User.current = get_current_user
		session[:user_id] = current_user.id
		User.where(id: current_user.id).update_all(last_interact_at: DateTime.now) if signed?
    Session.where(session_id: session.id).update_all(updated_at: DateTime.now)

		@current_ability = User.ability = Ability.new(current_user, request)

		@current_width_type = User.options[:current_width_type] = get_current_width_type
		cookies[:width_type] = current_width_type

		@current_purpose = User.options[:current_purpose] = get_current_purpose
		cookies[:purpose] = current_purpose
	end
 
	private
	# def set_locale
	# 	# begin
	# 	# 	if (cookies.has_key?('locale'))
	# 	# 		I18n.locale = cookies[:locale]
	# 	# 	else 
	# 	# 		I18n.locale = cookies[:locale] = params[:l] || I18n.default_locale
	# 	# 	end
	# 	# rescue
	# 	# 	I18n.locale = cookies[:locale] = I18n.default_locale
	# 	# end

	# 	begin
	# 		if (request.has_key? :purpose)
	# 			I18n.locale = cookies[:locale]
	# 		else 
	# 			I18n.locale = cookies[:locale] = params[:l] || I18n.default_locale
	# 		end
	# 	rescue
	# 		I18n.locale = cookies[:locale] = I18n.default_locale
	# 	end
	# end

# Current width type

	private
	def get_current_width_type
		cookies[:width_type]
	end

	def current_width_type
		@current_width_type # Always have (run in before_action (init))
	end

# / Current width type

# Current purpose
	
	private
	def get_current_purpose
		purposes = ['s', 'r']

		if request.GET.has_key?(:purpose) && purposes.include?(request.GET[:purpose])
			return cookies[:purpose] = request.GET[:purpose]
		elsif cookies.has_key?(:purpose) && purposes.include?(cookies[:purpose])
			return cookies[:purpose]
		else
			return cookies[:purpose] = 's'
		end
	end

	def current_purpose
		@current_purpose # Always have (run in before_action (init))
	end

# / Current purpose

# Current user

	private
	def get_current_user
		# if exists session user_id
		unless session[:user_id].nil?
			u = User.find_by id: session[:user_id]
			return u if u.present?
		end

		# if exists cookie user_account
		if cookies.has_key? :user_account
			result = User.check_signin_without_encode cookies[:user_account], cookies[:user_password]
			
			if result[:status] == 0
				return result[:result]
			end
		end

		return User.new
	end

	def signed?
		session[:user_id].present?
	end

	def current_user
		@current_user
	end

	def current_ability
		@current_ability # Always have (run in before_action (init))
	end

# / Current user

end