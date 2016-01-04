class SessionInfo < ActiveRecord::Base

	# Associations

		has_one :begin_session_info, class_name: 'SessionInfo', foreign_key: 'begin_session_info_id'

		has_many :flow_session_infos, class_name: 'SessionInfo', foreign_key: 'begin_session_info_id'

	# / Associations
	
	serialize :leave_infos, JSON
	serialize :signed_users, JSON

end
