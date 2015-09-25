module ProjectsHelper
	# params:
	# 	style_class
	# 	style
	def project_avatar p, params = {}
		params[:style] ||= 'thumb'
		"<img class=\"#{params[:style_class]}\" src=\"#{p.images.count > 0 ? p.images[0].image.url(params[:style]) : "/assets/projects/#{params[:style]}/default.png"}\" alt=\"#{p.title}\">".html_safe
	end
end