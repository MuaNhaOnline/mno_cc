class Session < ActiveRecord::Base
	
	# Defaults

  	default_scope { order('created_at asc') }

	# / Defaults

	# Associations

		belongs_to :begin_session, class_name: 'Session'

		has_many :flow_sessions, class_name: 'Session', foreign_key: 'begin_session_id'

	# / Associations

end