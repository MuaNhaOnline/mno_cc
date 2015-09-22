module UsersHelper
	def user_avatar user, params = {}
		"<img class=\"img-circle #{params[:style_class]}\" src=\"#{user.avatar_image.nil? ? '/assets/users/default.png' : image_path(user.avatar_image)}\" alt=\"#{user.full_name}\">".html_safe
	end
end
