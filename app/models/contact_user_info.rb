class ContactUserInfo < ActiveRecord::Base

	# Associations

		belongs_to :session_info

	# / Associations

	# Insert

		# Assign params

			def assign_attributes_with_params _params
				assign_attributes _params.permit([:name, :phone_number, :email, :session_info_id, :demand])
			end

		# / Assign params

		# Save with params

		def save_with_params _params, _skip_check_exists = false
			assign_attributes_with_params _params

			unless _skip_check_exists
				_same_contact = User.where("phone_number ~ '(\\y|,){1}(#{phone_number})(\\y|,){1}' OR email = '#{email}'").first
				if _same_contact.present?
					return { status: 5, code: 'user', result: _same_contact }
				end
				_same_contact = ContactUserInfo.where("phone_number ~ '(\\y|,){1}(#{phone_number})(\\y|,){1}' OR email = '#{email}'").first
				if _same_contact.present?
					return { status: 5, code: 'contact_user', result: _same_contact }
				end
			end

			if save
				{ status: 0 }
			else
				{ status: 3 }
			end
		end

		# / Save with params

	# / Insert

end
