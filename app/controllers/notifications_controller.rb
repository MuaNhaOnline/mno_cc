class NotificationsController < ApplicationController

	# Load more
	
		# Patial view
		# params: page
		def load_more
			page = params[:page].present? ? params[:page].to_s || 1
			per = 10

			notifications = Notification.get_by_current_user.page(page, per)

			return render json: { status: 1 } if notifications.count == 0

			render json: {
				status: 0,
				result: render_to_string(partial: 'mini_list', locals: { notifications: notifications })
			}
		end
	
	# / Load more

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
