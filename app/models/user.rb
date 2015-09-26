=begin
	attribute:
		active_status:
			0: OK
			1: unactive
			2: wait old email active (email_changed)
			3: wait new email active (email_changed)
		params:
			active_code

=end

class User < ActiveRecord::Base

  include PgSearch
  pg_search_scope :search, against: [:full_name], using: { tsearch: { prefix: true } }

  has_attached_file :avatar, 
  	styles: { mini: '40x40#', thumb: '100x100#', big: '150x150#' },
  	default_url: "/assets/users/default.png", 
  	:path => ":rails_root/app/assets/file_uploads/user_images/:style/:id_:filename", 
  	:url => "/assets/user_images/:style/:id_:filename"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\Z/

# Associates

# / Associates

# Validates

	validates :password, presence: { message: 'Mật khẩu không được bỏ trống' }
	validates :full_name, presence: { message: 'Họ tên không được bỏ trống' }

  validate :custom_validate

	def custom_validate
		if new_record?
			errors.add(:account, 'Tên tài khoản không hợp lệ') if account.blank? || User.exists?(account: account)
			errors.add(:email, 'Email không hợp lệ') if email.blank? || !ApplicationHelper.isValidEmail(email) || User.exists?(email: email)
		end
	end

# / Validates

# Attribute

	# Ability

	  def ability
		  @ability ||= User.ability
		end

	  def self.ability
		  @ability # always have
		end

		# Run with before_action (in application controller)
	  def self.ability= ability
		  @ability = ability
		end

		delegate :can?, :cannot?, to: :ability

	# / Ability

	# Current user

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

	# / Current user

	# Options

	  def self.options
		  @options # always have
		end

		# Run with before_action (in application controller)
	  def self.options= options
		  @options = options
		end

	# / Options

	# Hash params

	def _params
	  @_params ||= params.blank? ? {} : JSON.parse(params)
	end

	# / Hash params

# / Attribute

# Insert

	# Get params

	def assign_attributes_with_params params
		# Account
		params[:account] = params[:account].downcase if params.has_key? :account

		# Password
		if params.has_key? :password
			require 'digest/md5'
			params[:password] = ApplicationHelper.md5_encode(params[:password])	
		end

		# Birthday
		if params[:birthday].present?
			params[:birthday] = Date.strptime(params[:birthday], '%Y')
		end

    # Images

    if params[:avatar_id].present?
      _avatar_value = TemporaryFile.split_old_new params[:avatar_id].split(';')

      if _avatar_value[:new].present?
				TemporaryFile.get_files(_avatar_value[:new]) do |_avatar, _id|
          assign_attributes avatar: _avatar
        end
      elsif _avatar_value[:old].blank?
        assign_attributes avatar: nil
      end
    end

		assign_attributes params.permit [
			:account, :password, :email, :full_name, :birthday, :business_name,
			:phone_number, :address ]
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

		assign_attributes_with_params params

		user_params = {}
		email_changed = false
		
		# Active code
		if new_record?
			user_params[:active_status] = 1 
			user_params[:params] = { active_code: SecureRandom.base64 }.to_json
		# Check if change email
		else
			if email_changed?
				# Set active status to email change, wait old email active
				user_params[:active_status] = 2

				# Create active code
				_params['active_code'] = SecureRandom.base64
				_params['new_email'] = user_params[:email]
				user_params[:params] = _params.to_json

				# Not change new email
				email = email_was

				email_changed = true
			end
		end

		assign_attributes user_params

		if save
			{ status: 0, email_changed: email_changed }
		else
			{ status: 3, result: errors.full_messages[0] }
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
		return { status: 6 } if User.current.cannot? :manager, User

    user = find id

    hash = {}
    hash["is_#{type}"] = is
    user.assign_attributes(hash)

    user.save validate: false

    { status: 0 }
	end

	# Active
	def self.active_account id, code
		user = find id
		
		# If not exist or active status is ok
		return { status: 1 } if user.nil? || user.active_status == 0

		case user.active_status
			when 1
				if user._params['active_code'] == code
					user.active_status = 0
					user._params.delete 'active_code'
					user.params = user._params.to_json

					user.save validate: false

					return { status: 0, result: 1 }
				else
					return { status: 3 }
				end
			when 2
				if user._params['active_code'] == code
					user.active_status = 3
					user._params['active_code'] = SecureRandom.base64
					user.params = user._params.to_json

					user.save validate: false

					return { status: 0, result: 2, user: user }
				else
					return { status: 3 }
				end
			when 3
				if user._params['active_code'] == code
					user.active_status = 0
					user.email = user._params['new_email']

					user._params.delete 'active_code'
					user._params.delete 'new_email'

					user.params = user._params.to_json

					user.save validate: false

					return { status: 0, result: 3 }
				else
					return { status: 3 }
				end
		end

		{ status: 1 }
	end

	# Change password
	# return
	# 	error status:
	# 		1: uncorress old password
	def self.change_password params
		user = find params[:id]

		return { status: 6 } if current.cannot? :edit, user

		# If not exist
		return { status: 1 } if user.nil?

		# Check old password
		return { status: 5, result: 'Mật khẩu cũ không đúng' } if user.password != ApplicationHelper.md5_encode(params[:old_password])

		user.password = ApplicationHelper.md5_encode params[:password]
		if user.save validate: false
			{ status: 0 }
		else
			{ status: 3 }
		end
	end

	# Restore password
	def self.restore_password email
		user = User.where(email: email).first

		return { status: 1 } if user.nil?

		new_password = SecureRandom.hex(4)

		user.password = ApplicationHelper.md5_encode new_password
		if user.save validate: false
			{ status: 0, result: { user: user, new_password: new_password } }
		else
			{ status: 2 }
		end
	end

# / Update

# Handle

	# Signin

  # return:
  #   error status 
  #     1: id is not exist
  #     2: password is not correct
	def self.check_signin account, password
		# Author
		return { status: 6 } if User.current.cannot? :signin, nil

		user = find_by_account account.downcase

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
		user = find_by_account account.downcase

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