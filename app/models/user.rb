class User < ActiveRecord::Base

  include PgSearch
  pg_search_scope :search, against: [:full_name]

  def ability
	  @ability ||= Ability.new(self)
	end

	delegate :can?, :cannot?, to: :ability

	def self.current
		@current_user
	end

	def self.current= user
		@current_user = user
	end

	def self.signed?
		!@current_user.new_record?
	end

	def self.from_omniauth auth
	  where(auth.slice(:provider, :uid)).first_or_initialize.tap do |user|
	    user.provider = auth.provider
	    user.provider_user_id = auth.uid
	    user.full_name = auth.info.name
	    user.provider_token = auth.credentials.token
	    user.provider_expires_at = Time.at(auth.credentials.expires_at)
	    user.save
	  end
	end

# Associates

	belongs_to :avatar_image, class_name: 'Image'

# / Associates

# Validates

	validates :password, presence: { message: 'Mật khẩu không được bỏ trống' }
	validates :full_name, presence: { message: 'Họ tên không được bỏ trống' }
	validates :birthday, presence: { message: 'Ngày sinh không được bỏ trống' }

  validate :custom_validate

	def custom_validate
		if new_record?
			errors.add(:account, 'Tên tài khoản không hợp lệ') if account.blank? || User.exists?(account: account)
			errors.add(:email, 'Email không hợp lệ') if email.blank? || !ApplicationHelper.isValidEmail(email) || User.exists?(email: email)
		end
	end

# / Validates

# Insert

	# Get params

	def self.get_params params
		# Password
		if params.has_key? :password
			require 'digest/md5'
			params[:password] = ApplicationHelper.md5_encode(params[:password])	
		end

		# Birthday
		params[:birthday] = Date.strptime(params[:birthday], '%d/%m/%Y')

		params.permit [
			:account, :password, :email, :full_name, :birthday, :business_name,
			:phone_number, :address, :avatar_image_id ]
	end

	# / Get params

	# Save with params

	def save_with_params params
		# Author
		if new_record?
			return { status: 6 } if User.current.cannot? :signup, nil
		else
			return { status: 6 } if User.current.cannot? :edit, self
		end

		user_params = User.get_params params

		assign_attributes user_params

		if save
			{ status: 0 }
		else
			{ status: 3 }
		end
	end

	# / Save with params

# / Insert

# Get

	# Get user by keyword and type
	def self.search_by_type keyword, type, is
		if keyword.blank?
      where("is_#{type} = #{is}")
    else
      if is
        search(keyword).where("is_#{type} = true")
      else
        where("is_#{type} = false").search(keyword)
      end
    end
	end

# /Get

# Update

	# Update type by id
	def self.update_type_by_id id, type, is
		# Author
		return { status: 6 } if current_user.cannot? :manager, User

    user = find id

    hash = {}
    hash["is_#{type}"] = is
    user.assign_attributes(hash)

    user.save validate: false

    { status: 0 }
	end

# / Update

# Handle

	# Signin

	def self.check_signin account, password
		# Author
		return { status: 6 } if User.current.cannot? :signin, nil

		user = find_by_account account

		# Check if user exist with account
		if user.nil?
			return { status: 5, result: { status: 1, result: I18n.t('user.validate.account_not_exist') } }
		end

		# Check if password not correct
		if user.password != ApplicationHelper.md5_encode(password)
			return { status: 5, result: { status: 2, result: I18n.t('user.validate.password_not_correct') } }
		end

		{ status: 0, result: user }
	end

	def self.check_signin_without_encode account, password
		user = find_by_account account

		# Check if user exist with account
		if user.nil?
			return { status: 5, result: { status: 1, result: I18n.t('user.validate.account_not_exist') } }
		end

		# Check if password not correct
		if user.password != password
			return { status: 5, result: { status: 2, result: I18n.t('user.validate.password_not_correct') } }
		end

		{ status: 0, result: user }
	end

	# / Signin

# / Handle

end