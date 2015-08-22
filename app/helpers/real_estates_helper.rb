module RealEstatesHelper
	def real_estate_avatar re, params = {}
		"<img class=\"img-round #{params[:style_class]}\" src=\"#{re.images.count > 0 ? '/images/' + re.avatar_image_id.to_s : '/assets/real_estates/default.png'}\" alt=\"#{re.title}\">".html_safe
	end
end
