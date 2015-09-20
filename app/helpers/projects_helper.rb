module ProjectsHelper
	# params
	# 	style_class
	def project_avatar p, params = {}
		"<img class=\"#{params[:style_class]}\" src=\"#{p.images.count > 0 ? '/images/' + p.images[0].id.to_s : '/assets/projects/default.png'}\" alt=\"#{p.title}\">".html_safe
	end
end