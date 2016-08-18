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

	# Get
	
		def self.get_without_view_action
			where.not(action: 'view')
		end

		def self.get_for_build
			where(object_type: ['real_estate', 'project', 'user'])
		end
	
	# / Get

end
