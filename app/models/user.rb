class User < ActiveRecord::Base

# Associates

	has_one :avatar_image, class_name: 'Image'

# / Associates

# Validates

	validates :password, presence: { message: 'Mật khẩu không được bỏ trống' }
	validates :full_name, presence: { message: 'Họ tên không được bỏ trống' }
	validates :birthday, presence: { message: 'Ngày sinh không được bỏ trống' }

  validate :custom_validate

	def custom_validate
		errors.add(:account, 'Tên tài khoản không hợp lệ') if account.blank? || User.exists?(account: account)
		errors.add(:email, 'Email không hợp lệ') if email.blank? || !ApplicationHelper.isValidEmail(email) || User.exists?(email: email)
	end

# / Validates

	# Get params

	def self.get_params params
		# Password
		require 'digest/md5'
		params[:password] = ApplicationHelper.md5_encode(params[:password])	

		# Birthday
		params[:birthday] = Date.strptime(params[:birthday], '%d/%m/%Y')

		params.permit [
			:account, :password, :email, :full_name, :birthday, :business_name,
			:phone_number, :address, :avatar_image_id ]
	end

	# / Get params

	# Save with params

	def save_with_params params
		user_params = User.get_params params

		assign_attributes user_params

		save
	end

	# / Save with params

	# Signin

	def self.check_signin account, password
		user = find_by_account account

		# Check if user exist with account
		if user.nil?
			return { status: 5, result: I18n.t('user.validate.account_not_exist') }
		end

		# Check if password not correct
		if user.password != ApplicationHelper.md5_encode(password)
			return { status: 5, result: I18n.t('user.validate.password_not_correct') }
		end

		{ status: 0, result: user }
	end

	# / Signin

end