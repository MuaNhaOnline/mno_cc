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
	pg_search_scope :search, against: [:full_name], using: { tsearch: { prefix: true, any_word: true } }

	has_attached_file :avatar, 
		styles: { mini: '40x40#', thumb: '100x100#', big: '150x150#' },
		default_url: "/assets/users/:style/default.png", 
		:path => ":rails_root/app/assets/file_uploads/user_images/:style/:id_:filename", 
		:url => "/assets/user_images/:style/:id_:filename"
	validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\Z/

	# Associations

		has_many :users_favorite_real_estates, class_name: 'UsersFavoriteRealEstate'
		has_many :favorite_real_estates, through: :users_favorite_real_estates, source: 'real_estate'
		has_many :users_favorite_projects, class_name: 'UsersFavoriteProject'
		has_many :favorite_projects, through: :users_favorite_projects, source: 'project'

	# / Associations

	# Validations

		validate :custom_validate

		def custom_validate
			if provider.blank?
				if new_record?
					errors.add(:account, 'Tên tài khoản không hợp lệ') if account.blank? || User.exists?(account: account)
					errors.add(:email, 'Email không hợp lệ') if email.blank? || !ApplicationHelper.isValidEmail(email) || User.exists?(email: email)
				end

				errors.add(:password, 'Mật khẩu không được bỏ trống') if password.blank?
				errors.add(:full_name, 'Họ tên không được bỏ trống') if full_name.blank?
			end
		end

	# / Validations

	# Attribute

		serialize :params, JSON

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
				where(provider: auth.provider, provider_user_id: auth.uid).first_or_initialize.tap do |user|
					user.provider = auth.provider
					user.provider_user_id = auth.uid
					user.full_name = auth.info.name
					user.email = auth.info.email
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

	# / Attribute

	# Insert

		# Get params

		def assign_attributes_with_params _params
			# Account
			_params[:account] = _params[:account].downcase if _params.has_key? :account

			# Password
			if _params.has_key? :password
				require 'digest/md5'
				_params[:password] = ApplicationHelper.md5_encode _params[:password]
			end

			# Birthday
			if _params[:birthday].present?
				_params[:birthday] = Date.strptime(_params[:birthday], '%Y')
			end

			# Avatar

			if _params[:avatar_id].present?
				_value = JSON.parse _params[:avatar_id]

				if _value['is_new']
					TemporaryFile.get_file(_value['id']) do |_avatar|
						assign_attributes avatar: _avatar
					end
				end
			else
				assign_attributes avatar: nil
			end

			assign_attributes _params.permit [
				:account, :password, :email, :full_name, :birthday, :business_name,
				:phone_number, :address ]
		end

		# / Get params

		# Save with params

		def save_with_params _params
			# Author
			if new_record?
				return { status: 6 } if User.current.cannot? :signup, nil
			else
				return { status: 6 } if User.current.cannot? :edit, self
			end

			assign_attributes_with_params _params

			_user_params = {}
			_email_changed = false
			
			# Active code
			if new_record?
				_user_params[:last_interact_at] = DateTime.now
				_user_params[:active_status] = 1 
				_user_params[:params] = { active_code: SecureRandom.base64 }
			# Check if change email
			else
				if email_changed?
					# Set active status to email change, wait old email active
					_user_params[:active_status] = 2

					# Create active code
					_user_params[:params] = {}
					_user_params[:params]['active_code'] = SecureRandom.base64
					_user_params[:params]['new_email'] = email

					# Not change new email
					assign_attributes email: email_was

					_email_changed = true
				end

				# Save changed fields for zoho sync
				zoho_is_changed = true
			end

			assign_attributes _user_params

			if save
				{ status: 0, email_changed: _email_changed }
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

		# View all search
		# params: 
		# 	keyword
		# 	interact, real_estate_count, project_count
		def self.view_all_search_with_params params
			where = ''
			joins = []
			order = {}

			if params.has_key? :interact
				order[:last_interact_at] = params[:interact]
			end

			if params.has_key? :real_estate_count
				order[:real_estate_count] = params[:real_estate_count]
			end

			if params.has_key? :project_count
				order[:project_count] = params[:project_count]
			end

			if params[:keyword].present?
				search(params[:keyword]).joins(joins).where(where).order(order)
			else
				joins(joins).where(where).order(order)
			end
		end

	# / Get

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

			case user.active_status
				when 0
					return { status: 0, result: 0 }
				when 1
					if user.params['active_code'] == code
						user.active_status = 0
						user.params.delete 'active_code'

						user.save validate: false

						return { status: 0, result: 1 }
					else
						return { status: 3 }
					end
				when 2
					if user.params['active_code'] == code
						user.active_status = 3
						user.params['active_code'] = SecureRandom.base64

						user.save validate: false

						return { status: 0, result: 2, user: user }
					else
						return { status: 3 }
					end
				when 3
					if user.params['active_code'] == code
						user.active_status = 0
						user.email = user.params['new_email']

						user.params.delete 'active_code'
						user.params.delete 'new_email'

						user.params = user.params.to_json
						user.zoho_is_changed = true

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
		def self.change_password _params
			user = find _params[:id]

			# Author
			return { status: 6 } if current.cannot? :edit, user

			# If not exist
			return { status: 1 } if user.nil?

			# Check old password
			return { status: 5, result: 'Mật khẩu cũ không đúng' } if user.password != ApplicationHelper.md5_encode(_params[:old_password])

			user.password = ApplicationHelper.md5_encode _params[:password]
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

		# Cancel change mail
		def self.cancel_change_email id
			user = find id

			# Author
			return { status: 6 } if current.cannot? :cancel_change_email, user

			user.active_status = 0
			user.params.delete 'active_code'
			user.params.delete 'new_email'
			if user.save
				{ status: 0 }
			else
				{ status: 3 }
			end
		end

		# Increase real_estate_count
		def self.increase_real_estate_count id
			user = User.find id
			user.real_estate_count += 1
			user.save
		end

		# Decrease real_estate_count
		def self.decrease_real_estate_count id
			user = User.find id
			user.real_estate_count -= 1
			user.save
		end

		# Increase project_count
		def self.increase_project_count id
			user = User.find id
			user.project_count += 1
			user.save
		end

		# Decrease project_count
		def self.decrease_project_count id
			user = User.find id
			user.project_count -= 1
			user.save
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

	# Zoho

		def self.zoho_fields
			@zoho_fields ||= ['email', 'full_name', 'birthday', 'business_name', 'phone_number', 'address']
		end
		
		def zoho_get_attribute _attribute
			case _attribute
			when 'zoho_id'
				{
					val: 'Id',
					text: zoho_id.to_s
				}
			when 'email'
				{
					val: 'Email',
					text: email
				}
			when 'full_name'
				{
					val: 'Last Name',
					text: full_name
				}
			when 'birthday'
				{
					val: 'Ngày sinh',
					text: birthday.present? ? birthday.strftime('%m/%d/%Y') : ''
				}
			when 'business_name'
				{
					val: 'Company',
					text: business_name
				}
			when 'phone_number'
				{
					val: 'Phone',
					text: phone_number
				}
			when 'address'
				{
					val: 'Địa chỉ',
					text: address
				}
			else
				nil
			end
		end

		def self.zoho_create_xml_nodes xml, user, attributes
			attributes.each do |attribute|

				# Get data from attribute (mno)
				data = user.zoho_get_attribute attribute

				# If not present => not add
				if data.present?

					# Add node
					xml.FL(val: data[:val]) {
						xml.text data[:text]
					}

				end

			end
		end

		def self.zoho_sync
			# Create new leads
				
				# Get all users without zoho id
				users = where zoho_id: nil

				# If exist
				if users.count > 0

					# Create xml records
					leads_records = Nokogiri::XML::Builder.new do |xml|
						xml.Leads {
							users.each_with_index do |user, index|

								xml.row(no: index + 1) {
									zoho_create_xml_nodes xml, user, zoho_fields
								}

							end
						}
					end

					result = HTTParty.post(
						'https://crm.zoho.com/crm/private/xml/Leads/insertRecords', 
						body: {
							authtoken: '427ecfa73f98d6aa29f7e932d3c2913f',
							scope: 'crmapi',
							xmlData: leads_records.to_xml,
							version: 4
						}
					)

					if result['response']['result'].present?
					end

					if result['response']['result'].present?
						if result['response']['result']['row'].class == Array
							result['response']['result']['row'].each_with_index do |record, index|
								if record.has_key? 'success'
									users[index].zoho_id = ApplicationHelper.zoho_get_content_by_val record['success']['details']['FL'], 'Id'
									users[index].zoho_is_changed = false
									users[index].save
								end
							end
						else
							record = result['response']['result']['row'].first
							if record[0] == 'success'
								users[0].zoho_id = ApplicationHelper.zoho_get_content_by_val record[1]['details']['FL'], 'Id'
								users[0].zoho_is_changed = false
								users[0].save
							end
						end
					end
				end
			
			# / Create new leads

			# Update leads
			
				# Get all user has zoho changed
				users = where(zoho_is_changed: true)

				# If exist
				if users.count > 0

					# Create xml records
					leads_records = Nokogiri::XML::Builder.new do |xml|
						xml.Leads {
							users.each_with_index do |user, index|

								xml.row(no: index + 1) {
									zoho_create_xml_nodes xml, user, zoho_fields + ['zoho_id']
								}

							end
						}
					end

					result = HTTParty.post(
						'https://crm.zoho.com/crm/private/xml/Leads/updateRecords', 
						body: {
							authtoken: '427ecfa73f98d6aa29f7e932d3c2913f',
							scope: 'crmapi',
							xmlData: leads_records.to_xml,
							version: 4
						}
					)

					if result['response']['result'].present?
						if result['response']['result']['row'].class == Array
							result['response']['result']['row'].each_with_index do |record, index|
								if record.has_key? 'success'
									users[index].zoho_is_changed = false
									users[index].save
								end
							end
						else
							record = result['response']['result']['row'].first
							if record[0] == 'success'
								users[0].zoho_is_changed = false
								users[0].save
							end
						end
					end

				end
				
			# / Update leads
		end

	# / Zoho

end