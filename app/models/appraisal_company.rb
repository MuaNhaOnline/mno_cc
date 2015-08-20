class AppraisalCompany < ActiveRecord::Base

  include PgSearch
  pg_search_scope :search, against: [:name]

# Associate

	belongs_to :avatar_image, class_name: 'Image'
	belongs_to :representative, class_name: 'User'
  
  has_and_belongs_to_many :users
  has_and_belongs_to_many :real_estates

# / Associate

# Validate
	
  validates :name, presence: { message: 'Tên công ty không thể bỏ trống' }
  validates :representative_id, presence: { message: 'Người đại diện không thể bỏ trống' }

# / Validate

# Insert

	# Get params

	def self.get_params params
		params.permit [
			:name, :representative_id, :avatar_image_id
		]
	end

	# / Get params

	# Save with params

	def save_with_params params
		# Author
		if new_record?
			return { status: 6 } if User.current_user.cannot? :create, AppraisalCompany
		else
			return { status: 6 } if User.current_user.cannot? :edit, self
		end

		ac_params = AppraisalCompany.get_params params

		assign_attributes ac_params

		if save
			{ status: 0 }
		else
			{ status: 3 }
		end
	end

	# / Save with params

# / Insert

# Delete
  
  def self.delete_by_id id
    ac = find id

    return { status: 1 } if ac.nil?

    return { status: 6 } if User.current_user.cannot? :delete, ac

    delete id

    { status: 0 }
  end

# / Delete

end
