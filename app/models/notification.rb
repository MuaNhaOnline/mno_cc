class Notification < ActiveRecord::Base

	# Default
	
		default_scope { order('created_at DESC') }
	
	# / Default

	# Associations

		belongs_to :real_estate, foreign_key: 'object_id'
		belongs_to :contact_request, foreign_key: 'object_id'

		belongs_to :interact_user, class_name: 'User', foreign_key: 'user_id'
		belongs_to :interact_contact_user, class_name: 'ContactUserInfo', foreign_key: 'user_id'
	
		has_many :receivers, class_name: 'NotificationReceiver', autosave: true, dependent: :destroy
	
	# / Associations

	# Save
	
		def self.create_new params
			noti = self.new params

			# Get users

				# Get relative users
				relative_users = case noti.object_type
				when 'real_estate'
					RealEstate
				when 'contact_request'
					ContactRequest
				end.need_notify_users(noti)

				# Get 'user' type
				user_ids = relative_users.map{ |value| value[1] == 'user' ? value[0] : nil }.select{ |value| !value.nil? }

				return true if user_ids.blank?

				# Send notification
				noti.receivers = user_ids.map{ |user_id| NotificationReceiver.new user_id: user_id }

			# / Get user_ids

			noti.save
		end
	
	# / Save

	# Get
	
		def self.unread
			Notification.joins(:receivers).where(notification_receivers: { is_read: false })
		end
	
		def self.get_by_current_user
			return [] unless User.signed?

			Notification.joins(:receivers).where(notification_receivers: { user_id: User.current.id })
		end
	
	# / Get

	# Attributes
	
		def read?
			self.receivers.where(user_id: User.current.id).first.is_read
		end
	
	# / Attributes

end
