=begin Attributes rules
	
	status
		1: Waiting contact
		2: Recontact
		3: Eliminate
		4: Done

=end 

class ContactRequest < ActiveRecord::Base

	# Associations

		belongs_to :user_request, class_name: 'User', foreign_key: 'user_id'
		belongs_to :contact_user_request, class_name: 'ContactUserInfo', foreign_key: 'user_id'

		has_many :results, class_name: 'ContactRequestResult'

	# / Associations

	# Attributes

		def self.need_contact
			order(updated_at: 'asc').where('status = 1 OR status = 2')
		end

	# / Attributes

end
