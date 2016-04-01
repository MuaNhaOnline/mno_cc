class UsersFavoriteRealEstate < ActiveRecord::Base
	belongs_to :user  
	belongs_to :real_estate

	# Add

		def self.add_favorite real_estate_id
			# Author
			return { status: 6 } if User.current.cannot? :create, UsersFavoriteRealEstate

			if create user_id: User.current.id, real_estate_id: real_estate_id
				{ status: 0 }
			else
				{ status: 2 }
			end
		end

	# / Add

	# Remove

		def self.remove_favorite real_estate_id
			favorite_re = where(user_id: User.current.id, real_estate_id: real_estate_id)

			# Author
			return { status: 6 } if User.current.cannot? :delete, favorite_re.first

			if favorite_re.delete_all
				{ status: 0 }
			else
				{ status: 2 }
			end
		end

	# / Remove

end
