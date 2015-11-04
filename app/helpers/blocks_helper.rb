module BlocksHelper
	# params:
	# 	style_class
	# 	style
	# 	attribute
	# 	open_gallery
	def block_avatar block, params = {}
		params[:style] ||= 'thumb'
		"<img #{params[:open_gallery] && block.images.count > 0 ? "aria-gallery='block' data-value='#{block.id.to_s}' data-id='#{block.images[0].id}'" : ''} #{params[:attribute]} class=\"#{params[:style_class]}\" src=\"#{block.images.count > 0 ? block.images[0].image.url(params[:style]) : "/assets/blocks/#{params[:style]}/default.png"}\" alt=\"#{block.name}\">".html_safe
	end
end
