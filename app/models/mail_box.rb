class MailBox < ActiveRecord::Base

# Associates

	belongs_to :from, class_name: 'User'
	belongs_to :to, class_name: 'User'
	belongs_to :attachment_file, class_name: 'Image'

# / Associates

# Validates

	validates :from_id, presence: { message: 'Người gửi không được bỏ trống' }
	validates :to_id, presence: { message: 'Người nhận không được bỏ trống' }
	validates :subject, presence: { message: 'Chủ đề không được bỏ trống' }

  validate :custom_validate

	def custom_validate
	end

# / Validates

# Insert

	# Get params

	def self.get_params params
		params.permit [ :to_id, :from_id, :reply_id, :subject, :attachment_file_id ]
	end

	# / Get params

	# Save with params

	def save_with_params params
		# Author
		return { status: 6 } if User.current_user.cannot? :create, MailBox

		if params.has_key? :reply_id
			reply_mail = MailBox.find params[:reply_id]
			if reply_mail.nil?
				params.delete :reply_id
			else
				return { status: 6 } if User.current_user.cannot? :reply, reply_mail
				params[:to_id] = reply_mail.from_id === User.current_user.id ? reply_mail.to_id : reply_mail.from_id
			end
		end

		mail_params = MailBox.get_params params

		assign_attributes mail_params

		if save
			{ status: 0 }
		else
			{ status: 3, result: errors.full_messages }
		end
	end

	# / Save with params

# / Insert

# Get

	# Get inbox of current user

	def self.get_current_inbox
		where to_id: User.current_user.id #, is_to_remove: false)
	end

	# / Get inbox of current user


# / Get

end
