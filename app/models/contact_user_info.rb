class ContactUserInfo < ActiveRecord::Base

	# Associations

		belongs_to :session_info

	# / Associations

	# Save

		# Assign params

			def assign_attributes_with_params params
				assign_attributes params.permit [
					:name, :phone_number, :email, :session_info_id, :demand
				]
			end

		# / Assign params

		# Save with params

			def save_with_params params
				self.assign_attributes_with_params params

				if self.save
					{ status: 0 }
				else
					{ status: 2 }
				end
			end

		# / Save with params

	# / Save

end
