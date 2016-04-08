=begin Attributes rules

	request_type:
		contact
		register
	
	status
		1: Waiting contact
		2: Recontact
		3: Eliminate
		4: Done

=end 

class ContactRequest < ActiveRecord::Base

	# Associations

		belongs_to :user
		belongs_to :contact_user, class_name: 'ContactUserInfo', foreign_key: 'user_id'
		belongs_to :real_estate, foreign_key: 'object_id'
		belongs_to :project, foreign_key: 'object_id'

		has_many :results, class_name: 'ContactRequestResult'

	# / Associations

	# Get

		def self.need_contact
			order(updated_at: 'asc').where('status = 1 OR status = 2')
		end

		def self.real_estate_contact
			where(object_type: 'real_estate')
		end
	
	# / Get

	# Attributes

		def display_request_type
			@display_request_type ||=
			case request_type
			when 'register'
				'Đăng ký sản phẩm'
			when 'contact'
				'Liên hệ'
			else
				''
			end
		end

		def display_status
			@display_status ||=
			case status
			when 1
				'Chờ liên hệ'
			when 2
				'Chờ liên hệ lại'
			when 3
				'Đã bỏ qua'
			when 4
				'Đã liên hệ'
			else 
				''
			end
		end

	# / Attributes

	# Save

		# Assign attributes with params
		def assign_attributes_with_params _params
			assign_attributes _params.permit([:request_type, :object_type, :object_id, :message])
		end
	
		# Save with params
		def save_with_params _params
			if new_record?
				self.status = 1
			end

			assign_attributes_with_params _params

			if save
				{ status: 0 }
			else
				{ status: 3 }
			end
		end
	
	# / Save

end