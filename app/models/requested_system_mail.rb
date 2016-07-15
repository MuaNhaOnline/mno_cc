=begin
	Attributes:
		requested_type
			1: contact
			2: register
			3: advisory
		status
			1: need_contact
			2: not_use
			3: eliminated
			4: done
=end	

class RequestedSystemMail < ActiveRecord::Base

	# Associations
	
		belongs_to :mail, class_name: 'SystemMail', foreign_key: 'system_mail_id'
		belongs_to :real_estate, foreign_key: 'object_id'
		belongs_to :project, foreign_key: 'object_id'
		belongs_to :floor_real_estate, foreign_key: 'object_id'
	
	# / Associations

	# Get

		# By status
		
			def self.need_contact_list
				order(updated_at: 'ASC')
					.where('requested_system_mails.status = 1')
			end

			def self.eliminated_list
				order(updated_at: 'DESC')
					.where('requested_system_mails.status = 3')
			end

			def self.done_list
				order(updated_at: 'DESC')
					.where('requested_system_mails.status = 4')
			end
		
		# / By status
	
	# / Get

	# Attributes

		def display_requested_type
			@display_requested_type ||=
			case requested_type
			when 1
				'Liên hệ'
			when 2
				'Đăng ký sản phẩm'
			when 3
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

		def assign_attributes_with_params params
			self.assign_attributes params.permit [
				:status, :note
			]			
		end
	
		def save_with_params params
			# Assign attributes
			self.assign_attributes_with_params params

			# Save
			self.save
		end
	
	# / Save

end
