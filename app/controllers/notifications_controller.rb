class NotificationsController < ApplicationController

	# Mini list
	
		# Patial view
		# params: page, per
		def _mini_list
			# Get params
			page 	= 	(params[:page] || 1).to_i
			per 	= 	(params[:per] || 10).to_i

			# Get notifications
			notifications = Notification.get_by_current_user.page page, per

			# Check if empty
			return render json: { status: 1 } if notifications.count == 0

			# Render result
			render json: {
				status: 0,
				result: render_to_string(partial: 'mini_list', locals: { notifications: notifications })
			}
		end
	
	# / Mini list

	# Set read status
	
		# Handle
		# params: id(*)
		def set_read_status
			NotificationReceiver.where(notification_id: params[:id], user_id: current_user.id).update_all(is_read: true)

			render json: {
				status: 0
			}
		end
	
	# / Set read status

end
