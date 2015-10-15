module ProjectsHelper
	# params:
	# 	style_class
	# 	style
	# 	attribute
	# 	open_gallery
	def project_avatar p, params = {}
		params[:style] ||= 'thumb'
		"<img #{params[:open_gallery] && p.images.count > 0 ? "aria-gallery='project' data-value='#{p.id.to_s}' data-id='#{p.images[0].id}'" : ''} #{params[:attribute]} class=\"#{params[:style_class]}\" src=\"#{p.images.count > 0 ? p.images[0].image.url(params[:style]) : "/assets/projects/#{params[:style]}/default.png"}\" alt=\"#{p.title}\">".html_safe
	end
end