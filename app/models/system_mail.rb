=begin
	Attributes:
		system_mail_type:
			1: Normal
			2: Request
=end

class SystemMail < ActiveRecord::Base

	# Constants
	
		NORMAL_TYPE = 1
		REQUEST_TYPE = 2
	
	# / Constants

	# Associations

		belongs_to :sender, class_name: 'User'
		belongs_to :contact_sender, class_name: 'ContactUserInfo', foreign_key: 'sender_id'
		belongs_to :replied_mail, class_name: 'SystemMail', foreign_key: 'reply_id'

		has_one :requested_info, class_name: 'RequestedSystemMail', foreign_key: 'system_mail_id'
	
		has_many :receivers, class_name: 'SystemMailReceiver'

		accepts_nested_attributes_for :requested_info
		accepts_nested_attributes_for :receivers
	
	# / Associations

	# Get
	
		def self.my_inbox_list
			where = 
				'system_mail_receivers.receiver_type = \'user\'' +
				" AND system_mail_receivers.receiver_id = #{User.current.id}" +
				' AND system_mail_receivers.is_receiver_deleted = false'
			joins = :receivers
			order = { created_at: 'DESC' }

			self.joins(joins).where(where).reorder(order)
		end
	
		def self.my_sent_list
			where = 
				'system_mails.sender_type = \'user\'' +
				" AND system_mails.sender_id = #{User.current.id}" +
				' AND system_mails.is_sender_deleted = false'
			joins = []
			order = { created_at: 'DESC' }

			self.joins(joins).where(where).reorder(order)
		end
	
	# / Get

	# Save

		def assign_attributes_with_params params = {}
			params[:requested_info_attributes] = params.delete :requested_info

			# Receiver
			params[:receivers_attributes] = params[:receiver_ids].map{ |receiver_id|
				{
					receiver_type: 	'user',
					receiver_id: 	receiver_id
				}
			} if params[:receiver_ids].present?

			self.assign_attributes params.permit [
				:sender_type, :sender_id, :subject, :content, :system_mail_type, :reply_id,
				{
					receivers_attributes: [ :receiver_type, :receiver_id ],
					requested_info_attributes: [ :object_type, :object_id, :requested_type ]
				}
			]
		end
	
		def save_with_params params = {}
			self.assign_attributes_with_params params

			self.save
		end

		# Delete
		def set_delete
			# If sender
			if self.sender_id == User.current.id && self.sender_type == 'user'
				self.update is_sender_deleted: true
			else
				self.receivers.each do |receiver|
					# If receiver
					if receiver.receiver_id == User.current.id && receiver.receiver_type == 'user'
						return receiver.update is_receiver_deleted: true
					end
				end
			end
		end

		# Is read
		def set_is_read
			self.receivers.each do |receiver|
				# If receiver
				if receiver.receiver_id == User.current.id && receiver.receiver_type == 'user'
					return receiver.update is_read: true
				end
			end
		end
	
	# / Save

	# Class attributes
	
		def self.i18n_value field, value
			I18n.t("system_mail.values.#{field}.#{value}")
		end
	
	# / Class attributes

	# Attributes
	
		# Is rea
		def current_user_is_read
			@current_is_read ||= Proc.new do

				self.receivers.each do |receiver|
					# If receiver
					return receiver.is_read if receiver.receiver_id == User.current.id && receiver.receiver_type == 'user'
				end

			end.call
		end
	
	# / Attributes

end
