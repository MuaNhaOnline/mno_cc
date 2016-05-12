=begin
	action:
		RealEstate: view, create, edit, approve
=end


class Log < ActiveRecord::Base

	# Default
	
		default_scope { order('created_at desc') }
	
	# / Default

	# Associations

		belongs_to :user, foreign_key: 'object_id'
		belongs_to :real_estate, foreign_key: 'object_id'
		belongs_to :project, foreign_key: 'object_id'

		belongs_to :interact_user, class_name: 'User', foreign_key: 'user_id'
		belongs_to :interact_contact_user, class_name: 'ContactUserInfo', foreign_key: 'user_id'

	# / Associations

end
