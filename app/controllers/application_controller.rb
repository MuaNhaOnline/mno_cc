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
	helper_method :signed?, :current_user, :left_contact?, :current_left_contact, :current_user_type, :current_user_id, :bot?

	rescue_from CanCan::AccessDenied do |e|
		respond_to do |format|
			format.html { redirect_to('/search?error=author') }
			format.json { render json: { status: 6, result: 'author' } }
		end
	end

	def default_url_options(options = {})
		{ locale: I18n.locale }.merge options
	end

	def init
		# if request.get?
		# 	session[:first_get] = true unless session.has_key? :first_get

		# 	if session[:first_get]
		# 		session[:first_get] = false

		# 		session_info = SessionInfo.new

		# 		# Track campaign
		# 		if params[:utm_campaign].present?
		# 			session_info.utm_campaign 	= params[:utm_campaign]
		# 			session_info.utm_source 	= params[:utm_source]
		# 			session_info.utm_medium 	= params[:utm_medium]
		# 			session_info.utm_term 		= params[:utm_term]
		# 			session_info.utm_content 	= params[:utm_content]
		# 		end

		# 		# Track if have begin session
		# 		if cookies[:begin_session_info_id].present?
		# 			session_info.begin_session_info_id = cookies[:begin_session_info_id]
		# 		end

		# 		session_info.save
				
		# 		if cookies[:begin_session_info_id].blank?
		# 			cookies[:begin_session_info_id] = {
		# 			  value: session_info.id,
		# 			  expires: 6.months.from_now
		# 			}
		# 		end

		# 		session[:session_info_id] = session_info.id
		# 	end
			
		# 	unless cookies.has_key? :width_type
		# 		if params.has_key? :width_type
		# 			cookies[:width_type] = params[:width_type]
		# 			render plain: '0'
		# 		else
		# 			@location = request.path
		# 			render 'home/get_width', layout: false
		# 		end
		# 		return
		# 	end
		# end

		User.options = {}

		@current_user = User.current = get_current_user
		session[:user_id] = current_user.id

		@current_ability = User.ability = Ability.new(current_user, request)
	end
 
	# private
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

	# Current
	
		# Current user

			private def get_current_user
				# if exists session user_id
				unless session[:user_id].nil?
					u = User.find session[:user_id]
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
				@signed ||= session[:user_id].present?
			end

			def current_user
				@current_user # Always have (run in before_action (init))
			end

			def current_ability
				@current_ability # Always have (run in before_action (init))
			end

		# / Current user

		# Current contact user
		
			def left_contact? include_past = false
				if include_past
					@left_contact_include_past ||= session[:contact_user_id].present? || cookies[:contact_user_id].present?
				else
					@left_contact ||= session[:contact_user_id].present?
				end
			end

			def current_left_contact include_past = false
				if include_past
					@current_left_contact_include_past ||= left_contact?(true) ? ContactUserInfo.find(session[:contact_user_id] || cookies[:contact_user_id]) : ContactUserInfo.new
				else
					@current_left_contact ||= left_contact? ? ContactUserInfo.find(session[:contact_user_id]) : ContactUserInfo.new
				end
			end
		
		# / Current contact user

		def current_user_type
			if signed?
				'user'
			elsif left_contact?
				'contact_user'
			else
				'guess'
			end
		end

		def current_user_id
			if signed?
				current_user.id
			elsif left_contact?
				current_left_contact.id
			else
				nil
			end
		end
	
	# / Current

	# Bot?
	
		def bot?
			@bot ||= 
				Proc.new {
					Browser.new(request.env["HTTP_USER_AGENT"]).bot?
				}.call
		end
	
	# / Bot?

	# Controller helpers
	
		def _save_contact_user_info params
			return false if params.blank?

			contact_user = ContactUserInfo.where(email: params[:email]).first_or_initialize

			if contact_user.save_with_params params
				# Save cookie, session contact info
				cookies[:contact_user_id] = {
					value: contact_user.id,
					expires: 3.months.from_now
				}
				session[:contact_user_id] = contact_user.id

				contact_user
			else
				false
			end
		end

		def _route_helpers
			Rails.application.routes.url_helpers
		end
	
	# / Controller helpers

end