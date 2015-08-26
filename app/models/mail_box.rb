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
		params.permit [ :to_id, :from_id, :reply_id, :content, :subject, :attachment_file_id, :is_draft ]
	end

	# / Get params

	# Save draft

	def save_draft params
		# Is reply
		if params.has_key? :reply_id
			reply_mail = MailBox.find params[:reply_id]
			if reply_mail.nil?
				params.delete :reply_id
			else
				# Author
				return { status: 6 } if User.current.cannot? :reply, reply_mail
				params[:to_id] = reply_mail.from_id === User.current.id ? reply_mail.to_id : reply_mail.from_id
			end
		# Is send new
		else
			# Author
			return { status: 6 } if User.current.cannot? :create, MailBox
		end

		params[:is_draft] = true

		mail_params = MailBox.get_params params

		assign_attributes mail_params

		if save validate: false
			{ status: 0 }
		else
			{ status: 3, result: errors.full_messages }
		end
	end

	# / Save draft

	# Send mail

	def send_mail params
		# Is reply
		if params.has_key? :reply_id
			reply_mail = MailBox.find params[:reply_id]
			if reply_mail.nil?
				params.delete :reply_id
			else
				# Author
				return { status: 6 } if User.current.cannot? :reply, reply_mail
				params[:to_id] = reply_mail.from_id === User.currentuser.id ? reply_mail.to_id : reply_mail.from_id
			end
		# Is send new
		else
			# Author
			return { status: 6 } if User.current.cannot? :create, MailBox
		end

    params[:is_draft] = false

		mail_params = MailBox.get_params params

		assign_attributes mail_params

		if save
			{ status: 0 }
		else
			{ status: 3, result: errors.full_messages }
		end
	end

	# / Send mail

# / Insert

# Get

	# Get inbox of current user

	def self.get_current_inbox
		where to_id: User.current.id #, is_to_remove: false)
	end

	# / Get inbox of current user


# / Get

# Remove

	# Remove mail form inbox/send

	# params
	# 	ids: [1,2,3]
	# 	type: 'from' or 'to'
	def self.remove_by_ids ids, type
		mails = find ids

		# Author
		# key = 'remove_' + type
		# mails.each do |m|
		# 	return { status: 6 } if User.current.cannot?(key, m)
		# end

		if where('id IN (' + ids.join(',') + ')').update_all 'is_' + type + '_remove' => true
			{ status: 0 }
		else
			{ status: 3 }
		end
	end

	# / Remove mail form inbox/send


# / Remove

end
