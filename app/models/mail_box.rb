class MailBox < ActiveRecord::Base

  include PgSearch
  pg_search_scope :search, against: [:subject, :content], :associated_against => {
    :from => [:full_name],
    :to => [:full_name]
  }

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
		params.permit [ :to_id, :from_id, :reply_id, :content, :subject, :attachment_file_id ]
	end

	# / Get params

	# Save with params

	def save_with_params params, is_draft = false
		# Is reply
		if params.has_key? :reply_id
			# Check reply mail exist
			reply_mail = MailBox.find params[:reply_id]
			if reply_mail.nil?
				params.delete :reply_id
			else
				# Author
				return { status: 6 } if User.current.cannot? :reply, reply_mail
				params[:to_id] = reply_mail.from_id == User.current.id ? reply_mail.to_id : reply_mail.from_id
			end
		# Is send new
		else
			# Author
			return { status: 6 } if User.current.cannot? :create, MailBox
		end

		mail_params = MailBox.get_params params

		mail_params[:is_draft] = is_draft

		assign_attributes mail_params

		if save validate: !is_draft
			{ status: 0 }
		else
			{ status: 3 }
		end
	end

	# / Save draft

# / Insert

# Get

	# Get inbox of current user

	def self.get_current_inbox
		where(to_id: User.current.id).order(created_at: 'desc')#, is_to_remove: false
	end

	# / Get inbox of current user

	# Get sent of current user

	def self.get_current_sent
		where(from_id: User.current.id).order(created_at: 'desc')#, is_to_remove: false
	end

	# / Get sent of current user

	# Get draft of current user

	def self.get_current_draft
		where(from_id: User.current.id, is_draft: true).order(created_at: 'desc')#, is_to_remove: false
	end

	# / Get draft of current user

# / Get

# Remove

	# Remove mail form inbox/send

	# params
	# 	ids: [1,2,3]
	# 	type: 'from' or 'to'
	def self.remove_by_ids ids, type
		mails = find ids

		# Author
		if type === 'to'
			mails.each do |m|
				return { status: 6 } if User.current.cannot?(:remove_to, m)
			end
		else
			mails.each do |m|
				return { status: 6 } if User.current.cannot?(:remove_from, m)
			end
		end

		if where('id IN (' + ids.join(',') + ')').update_all 'is_' + type + '_remove' => true
			{ status: 0 }
		else
			{ status: 3 }
		end
	end

	# / Remove mail form inbox/send


# / Remove

end
