class SystemGroup < ActiveRecord::Base

	# Association
	
		has_and_belongs_to_many :users
		has_and_belongs_to_many :permissions
	
	# / Association

	# Save

		def assign_with_params params
			assign_attributes params.permit [
				:name, :description
			]
		end

		def save_with_params params
			self.assign_with_params params

			if self.save
				{ status: 0 }
			else
				{ status: 3 }
			end
		end	
	
	# / Save

	# Delete
	
		def self.delete_by_id id
			if self.destroy id
				{ status: 0 }
			else
				{ status: 3 }
			end
		end
	
	# / Delete

	# User
	
		def add_user user
			self.users << user

			if self.save
				{ status: 0 }
			else
				{ status: 3 }
			end
		end
	
		def remove_user user
			self.users.delete user

			if self.save
				{ status: 0 }
			else
				{ status: 3 }
			end
		end
	
	# / User

	# Permission
	
		def save_permissions permission_ids
			self.assign_attributes permission_ids: permission_ids

			if self.save
				{ status: 0 }
			else 
				{ status: 3 }
			end
		end
	
	# / Permission
end
