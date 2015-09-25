module RealEstatesHelper
	# params:
	# 	style_class
	# 	style
	def real_estate_avatar re, params = {}
		params[:style] ||= 'thumb'
		"<img class=\"#{params[:style_class]}\" src=\"#{re.images.count > 0 ? re.images[0].image.url(params[:style]) : "/assets/real_estates/#{params[:style]}/default.png"}\" alt=\"#{re.title}\">".html_safe
	end
end
