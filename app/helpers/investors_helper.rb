module InvestorsHelper
	def investor_avatar investor, params = {}
		"<img #{params[:attribute]} class=\"#{params[:style_class]}\" src=\"#{investor.avatar_image.nil? ? '/assets/investor/default.png' : '/images/' + investor.avatar_image_id.to_s}\" alt=\"#{investor.name}\">".html_safe
	end
end
