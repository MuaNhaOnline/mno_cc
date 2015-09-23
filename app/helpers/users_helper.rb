module UsersHelper
	# params:
	# 	style_class
	# 	style
	def user_avatar user, params = {}
		params[:style] ||= 'mini'
		"<img class=\"img-circle #{params[:style_class]}\" src=\"#{user.avatar.nil? ? '/assets/users/default.png' : user.avatar.url(params[:style]) }\" alt=\"#{user.full_name}\">".html_safe
	end
end
