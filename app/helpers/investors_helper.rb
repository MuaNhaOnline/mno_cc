module InvestorsHelper
	# params:
	# 	style_class
	# 	style
	def investor_avatar investor, params = {}
		params[:style] ||= 'thumb'
		"<img #{params[:attribute]} class=\"#{params[:style_class]}\" src=\"#{investor.logo.nil? ? '/assets/investor/logo/default.png' : investor.logo.url(params[:style]) }\" alt=\"#{investor.name}\">".html_safe
	end
end
