class Session < ActiveRecord::SessionStore::Session

	# Associations

		has_one :info, primary_key: 'session_id'

	# / Associations

end