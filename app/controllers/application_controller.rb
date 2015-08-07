=begin
  status
    0: Success
    1: No result
    2: Hanlde error
    3: Constraint error
    4: Need sign in
    5: Error of business
=end

class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :set_locale
 
	def set_locale
		begin
      if (false && cookies.has_key?('locale'))
        I18n.locale = cookies[:locale]
      else 
  	  	I18n.locale = cookies[:locale] = params[:l] || I18n.default_locale
      end
    rescue
	  	I18n.locale = cookies[:locale] = I18n.default_locale
    end
	end
end