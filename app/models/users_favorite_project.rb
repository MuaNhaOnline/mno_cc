class UsersFavoriteProject < ActiveRecord::Base
	belongs_to :user  
	belongs_to :project

	# Add

	def self.add_favorite project_id
		# Author
		return { status: 6 } if User.current.cannot? :add, UsersFavoriteProject

		create user_id: User.current.id, project_id: project_id
		{ status: 0 }
	end

	# / Add

	# Remove

	def self.remove_favorite project_id
		favorite_project = where(user_id: User.current.id, project_id: project_id)

		# Author
		return { status: 6 } if User.current.cannot? :remove, favorite_project.first

		if favorite_project.delete_all
			{ status: 0 }
		else
			{ status: 2 }
		end
	end

	# / Remove

end
