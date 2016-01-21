module RealEstateGroupsHelper
	# params:
	# 	style_class
	# 	style
	# 	attribute
	# 	open_gallery
	def block_real_estate_group_avatar group, params = {}
		params[:style] ||= 'thumb'
		"<img #{params[:open_gallery] && group.images.count > 0 ? "aria-gallery='real_estate' data-value='#{group.id.to_s}' data-id='#{group.images[0].id}'" : ''} #{params[:attribute]} class=\"#{params[:style_class]}\" src=\"#{group.images.count > 0 ? group.images[0].image.url(params[:style]) : "/assets/real_estates/#{params[:style]}/default.png"}\" alt=\"#{group.name}\">".html_safe
	end
end
