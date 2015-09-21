module ProjectsHelper
	# params
	# 	style_class
	def project_avatar p, params = {}
		"<img class=\"#{params[:style_class]}\" src=\"#{p.images.count > 0 ? image_path(p.images[0]) : '/assets/projects/default.png'}\" alt=\"#{p.title}\">".html_safe
	end
end