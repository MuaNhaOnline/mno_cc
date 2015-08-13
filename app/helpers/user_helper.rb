module UserHelper
	def user_avatar user
		"<img class=\"img-circle\" src=\"#{user.avatar_image.nil? ? '/assets/users/default.png' : '/images/' + user.avatar_image_id.to_s}\" alt=\"#{user.full_name}\">".html_safe
	end
end
