=begin Attributes rules

	request_type:
		advisory (general - in home/index)
		contact (product)
		register (product)
	
	status
		1: Waiting contact
		2: Recontact
		3: Eliminate
		4: Done

=end 

class ContactRequest < ActiveRecord::Base

	# Default
	
		default_scope { order('created_at desc') }
	
	# / Default

	# Associations

		belongs_to :user
		belongs_to :contact_user, class_name: 'ContactUserInfo', foreign_key: 'user_id'
		belongs_to :real_estate, foreign_key: 'object_id'
		belongs_to :project, foreign_key: 'object_id'
		belongs_to :real_estate, foreign_key: 'object_id'
		belongs_to :floor_real_estate, foreign_key: 'object_id'

		has_many :results, class_name: 'ContactRequestResult'

	# / Associations

	# Get

		def self.need_contact
			order(updated_at: 'asc').where('status = 1 OR status = 2')
		end

		def self.real_estate_contact
			where(object_type: 'real_estate', request_type: ['contact', 'register'])
		end

		def self.project_contact
			where(object_type: ['project', 'real_estate', 'real_estates/floor'], request_type: ['contact', 'register'])
		end

		def self.user_request user_type, user_id, params = {}
			where = "user_id = #{user_id} AND user_type = '#{user_type}'"
			joins = []
			order = {}

			return joins(joins).where(where).order(order)

			joins(joins).where(where).order(order)
		end

		def self.my_request params = {}
			where = "user_id = #{User.current.id} AND user_type = 'user'"
			joins = []
			order = {}

			return joins(joins).where(where).order(order)

			joins(joins).where(where).order(order)
		end

		# Get need notify users
		
			def self.need_notify_users notification
				case notification.action
				when 'create'
					User.joins(system_groups: :permissions).where(permissions: { id: 4 }).all.map{ |user| [user.id, 'user'] }
				else
					[]
				end
			end
		
		# / Get need notify users
	
	# / Get

	# Attributes

		def display_request_type
			@display_request_type ||=
			case request_type
			when 'register'
				'Đăng ký sản phẩm'
			when 'contact'
				'Liên hệ'
			when 'advisory'
				case object_type
				when 'real_estate'
					'Tư vấn BĐS'
				when 'finance'
					'Tư vấn tài chính'
				when 'law'
					'Tư vấn luật'
				when 'architecture'
					'Tư vấn kiến trúc'
				else
					'Tư vấn'
				end
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

		# Assign attributes with params
		def manage_assign_attributes_with_params _params
			assign_attributes _params.permit([:status, :note])
		end
	
		# Save with params
		def manage_save_with_params _params
			manage_assign_attributes_with_params _params

			if save
				{ status: 0 }
			else
				{ status: 3 }
			end
		end
	
	# / Save

end