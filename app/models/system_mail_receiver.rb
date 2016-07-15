class SystemMailReceiver < ActiveRecord::Base

	# Associations
		
		belongs_to :receiver, class_name: 'User'
		belongs_to :contact_receiver, class_name: 'ContactUserInfo', foreign_key: 'receiver_id'
	
	# / Associations

	# Get
	
		def self.current_user_unread
			self.where(receiver_id: User.current.id, receiver_type: 'user', is_read: false, is_receiver_deleted: false)
		end
	
	# / Get

	# Save
	
		# Multiple set is read
		def self.set_is_read_by_ids ids
			self.where(id: ids, receiver_id: User.current.id, receiver_type: 'user').update_all(is_read: true)
		end
	
	# / Save

end
