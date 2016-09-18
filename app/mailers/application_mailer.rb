class ApplicationMailer < ActionMailer::Base
	layout 'mail_layout'
	default from: '"MuanhaOnline" <admin@muanhaonline.com.vn>'

	helper_method :_route_helpers

	def _route_helpers
		Rails.application.routes.url_helpers
	end
end
