class Session < ActiveRecord::Base
	
	# Defaults

  	default_scope { order('created_at asc') }

	# / Defaults

	# Associations

		belongs_to :begin_session, class_name: 'Session'

		has_many :flow_sessions, class_name: 'Session', foreign_key: 'begin_session_id'

	# / Associations

	# Get

		def self.search_with_params _params
			where = ''

			where = "created_at >= '#{Date.new 2015, 1, 1}' AND created_at <= '#{Date.new 2015, 12, 31}'"

			where(where)
		end

	# / Get

end