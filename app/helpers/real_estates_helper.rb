module RealEstatesHelper
	# params: style_class
	def real_estate_avatar re, params = {}
		"<img class=\"#{params[:style_class]}\" src=\"#{re.images.count > 0 ? image_path(re.images[0]) : '/assets/real_estates/default.png'}\" alt=\"#{re.title}\">".html_safe
	end
end
