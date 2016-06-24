=begin
	Attributes:
		system_mail_type:
			0: Normal
			1: Request
=end

class SystemMail < ActiveRecord::Base

	# Associations

		belongs_to :sender, class_name: 'User'
		belongs_to :contact_sender, class_name: 'ContactUserInfo', foreign_key: 'sender_id'
		belongs_to :replied_mail, class_name: 'SystemMail', foreign_key: 'reply_id'

		has_one :requested_info, class_name: 'RequestedSystemMail', foreign_key: 'system_mail_id'
	
		has_many :receivers, class_name: 'SystemMailReceiver'

		accepts_nested_attributes_for :requested_info
	
	# / Associations

	# Save

		def assign_attributes_with_params params = {}
			params[:requested_info_attributes] = params.delete :requested_info

			self.assign_attributes params.permit [
				:sender_type, :sender_id, :subject, :content, :system_mail_type, :reply_id,
				{
					receivers: [],
					requested_info_attributes: [ :object_type, :object_id, :requested_type ]
				}
			]
		end
	
		def save_with_params params = {}
			self.assign_attributes_with_params params

			self.save
		end
	
	# / Save

end
