class Question < ActiveRecord::Base

  include PgSearch
  pg_search_scope :search, against: [:title, :content]

# Associate

	belongs_to :user
	belongs_to :respondent, class_name: 'User'

# / Associate

# Validates

	validate :custom_validate

	def custom_validate
		# Title
		if title.blank?
			errors.add :title, 'Tiêu đề không thể bỏ trống'
      return
		end

		# Content
		if content.blank?
			errors.add :content, 'Nội dung không thể bỏ trống'
      return
		end
		
		# Signed user
		if user_id == 0
			if email.blank? && phone_number.blank?
				errors.add :email, 'Thông tin liên lạc không thể bỏ trống'
	      return
	    end
		end

		# Answer
		if is_answered
			if respondent.blank?
				errors.add :respondent, 'Người trả lời không thể bỏ trống'
	      return
			end
			if answer.blank?
				errors.add :answer, 'Trả lời không thể bỏ trống'
	      return
			end
		end
	end

# / Validates

# Get

	def self.get_pinned
		where is_pinned: true, is_answered: true
	end

# / Get

# Insert

	# Get params

	def self.get_params params
		if params.has_key? :contact_info
			if ApplicationHelper.isValidEmail params[:contact_info]
				params[:email] = params[:contact_info]
			else
				params[:phone_number] = params[:contact_info]
			end
		end

		params.permit :title, :content, :user_id, :email, :phone_number
	end

	# / Get params

	# Save with params

	def save_with_params params
		question_params = Question.get_params params

		question_params[:respondent_id] = 0

    assign_attributes question_params

    if save
      { status: 0 }
    else 
      { status: 3 }
    end
	end

	# / Save with params

# / Insert

# Update

	def self.answer params
		question = find params[:id]

		params[:is_answered] = params[:answer].blank? ? false : true

		question.assign_attributes params.permit(:respondent_id, :answer, :is_answered)

		if question.save
			{ status: 0 }
		else
			{ status: 3 }
		end
	end

	def self.pin id, is_pinned
		question = find id

		question.is_pinned = is_pinned

		if question.save
			{ status: 0 }
		else
			{ status: 3 }
		end
	end

# / Update

# Delete

	def self.delete_by_id id
		if delete id
			{ status: 0 }
		else
			{ status: 2 }
		end
	end

# / Delete

end