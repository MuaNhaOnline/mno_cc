class SystemMailReceiver < ActiveRecord::Base

	# Associations
		
		belongs_to :receiver, class_name: 'User'
		belongs_to :contact_receiver, class_name: 'ContactUserInfo', foreign_key: 'receiver_id'
	
	# / Associations

end
