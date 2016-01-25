class Project < ActiveRecord::Base

	# PgSearch

		include PgSearch
		pg_search_scope :search, against: {
			meta_search_1: 'A',
			meta_search_2: 'B',
			meta_search_3: 'C'
		}, using: { 
			tsearch: { 
				any_word: true
			}
		}

	# / PgSearch

	# Associations

		belongs_to :user
		belongs_to :project_type
		belongs_to :street
		belongs_to :ward
		belongs_to :district
		belongs_to :province
		belongs_to :currency
		belongs_to :price_unit, class_name: 'Unit'
		belongs_to :investor

		has_many :images, class_name: 'ProjectImage', dependent: :destroy
		has_many :payment_attachments, class_name: 'ProjectPaymentAttachment', dependent: :destroy
		has_many :users_favorite_projects, class_name: 'UsersFavoriteProject'
		has_many :blocks, dependent: :destroy
		has_many :utilities, class_name: 'ProjectUtility', dependent: :destroy

	# / Associations

	# Validations

		validates :project_name, presence: { message: 'Tên dự án không được bỏ trống' }
		validates :description, presence: { message: 'Mô tả không được bỏ trống' }
		validates :province_id, presence: { message: 'Địa chỉ không được bỏ trống' }
		validates :district_id, presence: { message: 'Địa chỉ không được bỏ trống' }
		validates :street_id, presence: { message: 'Địa chỉ không được bỏ trống' }
		validates :campus_area, presence: { message: 'Diện tích khuôn viên không được bỏ trống' }
		validates :date_display_type, presence: { message: 'Cách hiển thị không được bỏ trống' }
		validates :price_unit_id, presence: { message: 'Đơn vị tính không được bỏ trống' }

		validate :custom_validate

		def custom_validate
			errors.add(:images, 'Có tối thiểu 1 hình ảnh') if images.length == 0
		end

	# / Validations

	# Insert

		# Get params

		def assign_attributes_with_params params
			# Project type
			params[:project_type_id] = params[:detail_project_type_id].present? ? params[:detail_project_type_id] : params[:project_type_id]

			# Description
			if params[:payment_method].present?
				params[:payment_method] = ApplicationHelper.encode_plain_text params[:payment_method]
			end

			# Get price
			if params.has_key? :unit_price
				params[:unit_price] = ApplicationHelper.format_i(params[:unit_price])
				params[:unit_price_text] = ApplicationHelper.read_money params[:unit_price]
			end

			# Area
			params[:campus_area] = ApplicationHelper.format_f params[:campus_area] if params.has_key? :campus_area
			params[:width_x] = ApplicationHelper.format_f params[:width_x] if params.has_key? :width_x
			params[:width_y] = ApplicationHelper.format_f params[:width_y] if params.has_key? :width_y

			# Constructional quality
			if params.has_key? :using_ratio
				using_ratio = ApplicationHelper.format_f(params[:using_ratio]).to_f
				params[:using_ratio] = using_ratio < 0 ? 0 : (using_ratio > 100 ? 100 : using_ratio)
			end

			# Investor
			if params[:investor_id] == '0' && !params[:investor_id_ac].blank?
				investor = Investor.find_or_create_by name: params[:investor_id_ac]
				params[:investor_id] = investor.id
			end

			# Location
			unless params[:province].blank?
				if params[:province] == 'Hồ Chí Minh'
					params[:province] = 'Tp. Hồ Chí Minh'
				end
				province = Province.find_or_create_by name: params[:province]
				params[:province_id] = province.id
			end
			unless params[:district].blank?
				district = District.find_or_create_by name: params[:district], province_id: params[:province_id]
				params[:district_id] = district.id
			end
			unless params[:ward].blank?
				ward = Ward.find_or_create_by name: params[:ward]
				params[:ward_id] = ward.id
			end
			unless params[:street].blank?
				street = Street.find_or_create_by name: params[:street]
				params[:street_id] = street.id
			end

			# Images
			
			_images = []
			_has_avatar = false
			if params[:image_ids].present?
				params[:image_ids].each do |_v|
					_value = JSON.parse _v
					_value['is_avatar'] ||= false

					if _value['is_new']
						TemporaryFile.get_file(_value['id']) do |_image|
							_images << ProjectImage.new(image: _image, is_avatar: _value['is_avatar'], order: _value['order'], description: _value['description'])

							_has_avatar = true if _value['is_avatar']
						end
					else
						_image = ProjectImage.find _value['id']
						_image.description = _value['description']
						_image.is_avatar = _value['is_avatar']
						_image.order = _value['order']
						_image.save if _image.changed?          

						_has_avatar = true if _value['is_avatar']

						_images << _image
					end
				end
			end
			if !_has_avatar && _images.length != 0
				_images[0].assign_attributes is_avatar: true
			end
			assign_attributes images: _images

			# Attachment
			_attactments = []
			_has_avatar = false
			if params[:payment_attachment_ids].present?
				params[:payment_attachment_ids].each do |_v|
					_value = JSON.parse _v

					if _value['is_new']
						TemporaryFile.get_file(_value['id']) do |_file|
							_attactments << ProjectPaymentAttachment.new(file: _file, order: _value['order'], description: _value['description'])
						end
					else
						_file = ProjectPaymentAttachment.find _value['id']
						_file.description = _value['description']
						_file.order = _value['order']
						_file.save if _file.changed?          

						_has_avatar = true if _value['is_avatar']

						_attactments << _file
					end
				end
			end
			assign_attributes payment_attachments: _attactments

			# Utilities
			_utilities = []
			params[:utilities].each_value do |_value|
				_utility = _value[:id].present? ? ProjectUtility.find(_value[:id]) : ProjectUtility.new

				_utility.title = _value[:title]
				_utility.description = ApplicationHelper.encode_plain_text(_value[:description])
				_images = []
				if _value[:images].present?
					_value[:images].each do |_v|
						_v = JSON.parse _v

						if _v['is_new']
							TemporaryFile.get_file(_v['id']) do |_image|
								_images << ProjectUtilityImage.new(image: _image, order: _v['order'], description: _v['description'])
							end
						else
							_image = ProjectUtilityImage.find _v['id']
							_image.description = _v['description']
							_image.order = _v['order']
							_image.save if _image.changed?          

							_images << _image
						end
					end
				end
				_utility.images = _images

				_utilities << _utility
			end
			assign_attributes utilities: _utilities

			assign_attributes params.permit [
				:project_name, :slogan, :description, :unit_price, :unit_price_text, :currency_id, :payment_method, 
				:price_unit_id, :position_description,
				:lat, :long, :address_number, :province_id, :district_id, :ward_id, :street_id, 
				:project_type_id, :campus_area, :width_x, :width_y, :is_draft,
				:using_ratio, :estimate_starting_date, :estimate_finishing_date,
				:starting_date, :finished_base_date, :transfer_date, :docs_issue_date,
				:investor_id, :unit_description,:user_id, :date_display_type
			]
		end

		# Save with params

		def save_with_params params, is_draft = false
			# Author
			if new_record?
				return { status: 6 } if User.current.cannot? :create, Project
			else
				return { status: 6 } if User.current.cannot? :edit, self
			end

			assign_attributes_with_params params

			other_params = {
				is_draft: is_draft,
				is_pending: true,
				slug: ApplicationHelper.to_slug(ApplicationHelper.de_unicode(self.project_name))
			}

			assign_attributes other_params

			assign_meta_search

			_is_new_record = new_record?

			if save validate: !is_draft
				User.increase_project_count User.current.id if _is_new_record
				{ status: 0 }
			else 
				{ status: project_params[:date_display_type] }
			end
		end

		# / Save with params

	# / Insert

	# Updates

		# Update show status

		def self.update_show_status id, is_show
			project = find id

			# Author
			return { status: 6 } if User.current.cannot? :change_show_status, project

			project.is_show = is_show

			if project.save validate: false
				{ status: 0 }
			else
				{ status: 2 }
			end
		end

		# / Update show status

		# Update pending status

		def self.update_pending_status id, is_pending
			# Author
			return { status: 6 } if User.current.cannot? :approve, Project

			project = find id

			project.is_pending = is_pending

			if project.save validate: false
				{ status: 0 }
			else
				{ status: 2 }
			end
		end

		# / Update pending status

		# Update force hide status

		def self.update_force_hide_status id, is_force_hide
			project = find id

			# Author
			return { status: 6 } if User.current.cannot? :change_force_hide_status, project

			project.is_force_hide = is_force_hide

			if project.save validate: false
				{ status: 0 }
			else
				{ status: 2 }
			end
		end

		# / Update force hide status

		# Update favorite status

		def self.update_favorite_status id, is_favorite
			project = find id

			# Author
			return { status: 6 } if User.current.cannot? :change_favorite_status, project

			project.is_favorite = is_favorite

			if project.save validate: false
				{ status: 0 }
			else
				{ status: 2 }
			end
		end

		# / Update favorite status

	# / Update

	# Delete
		
		def self.delete_by_id id
			project = find id

			return { status: 1 } if project.nil?

			# Author
			return { status: 6 } if User.current.cannot? :delete, project

			_user_id = project.user_id

			if destroy id
				User.decrease_project_count _user_id
				{ status: 0 }
			else
				{ status: 2 }
			end
		end

	# / Delete

	# Get

		# Search with params

		# params: 
		#   keyword, page, price(x;y), district, price_from, price_to, currency_unit, unit, project
		#   newest
		def self.search_with_params params = {}
			where = 'is_pending = false AND is_show = true AND is_force_hide = false'
			joins = []
			order = {}

			if params[:project].present?
				return where(id: params[:project])
			end

			# Price
			if params.has_key? :price
				price_range = params[:price].split(';')
				where += " AND unit_price IS NOT NULL AND unit_price BETWEEN #{price_range[0]} AND #{price_range[1]}"
				
				order[:unit_price] = 'asc'
			end

			# Price range
			if params[:price_from].present? || params[:price_to].present?
				# Format number
				params[:price_from] = ApplicationHelper.format_f(params[:price_from]).to_f if params[:price_from].present?
				params[:price_to] = ApplicationHelper.format_f(params[:price_to]).to_f if params[:price_to].present?

				# Get currency unit & parse number
				currency_unit = 'VND'

				case params[:currency_unit]
				when 'billion'
					params[:price_from] *= 1000000000 if params[:price_from].present?
					params[:price_to] *= 1000000000 if params[:price_to].present?
				when 'million'
					params[:price_from] *= 1000000 if params[:price_from].present?
					params[:price_to] *= 1000000 if params[:price_to].present?
				when 'USD'
					currency_unit = 'USD'
				when 'SJC'
					currency_unit = 'SJC'
				end

				# Get unit
				unit = params[:unit].present? ? params[:unit] : 'per'

				# Call
				# Join currency
				joins << :currency
				# Join unit
				joins << :price_unit

				# Condition
				where += " AND currencies.code = '#{currency_unit}' AND units.code = '#{unit}'"
				where += " AND unit_price >= #{params[:price_from]}" if params[:price_from].present?
				where += " AND unit_price <= #{params[:price_to]}" if params[:price_to].present?
			end

			# District
			if params[:district].present?
				joins << :district
				where += " AND districts.id = #{params[:district]} "
			end

			# Time order
			if params.has_key? :newest
				order[:created_at] = 'desc'
			end

			joins = joins.uniq

			# Keyword
			if params[:keyword].present?
				search(params[:keyword]).joins(joins).where(where).order(order)
			else
				joins(joins).where(where).order(order)
			end
		end

		# params: 
		#   keyword,
		#   newest, cheapest, interact, view, id
		def self.my_search_with_params params = {}
			where = "user_id = #{User.current.id}"
			joins = []
			order = {}

			if params.has_key? :view
				order[:view_count] = params[:view]
			end

			if params.has_key? :interact
				order[:updated_at] = params[:interact]
			end

			if params.has_key? :id
				order[:id] = params[:id]
			end

			if params[:keyword].present?
				search(params[:keyword]).joins(joins).where(where).order(order)
			else
				joins(joins).where(where).order(order)
			end
		end

		# params: 
		#   keyword,
		#   newest, cheapest, interact, view, id
		def self.my_favorite_search_with_params params = {}
			where = "users_favorite_projects.user_id = #{User.current.id}"
			joins = [:users_favorite_projects]
			order = {}

			if params.has_key? :view
				order[:view_count] = params[:view]
			end

			if params.has_key? :interact
				order[:updated_at] = params[:interact]
			end

			if params.has_key? :id
				order[:id] = params[:id]
			end

			if params[:keyword].present?
				search(params[:keyword]).joins(joins).where(where).order(order)
			else
				joins(joins).where(where).order(order)
			end
		end

		# params: 
		#   keyword,
		#   newest, cheapest, interact, view, id
		def self.pending_search_with_params params = {}
			where = 'is_pending = true AND is_draft = false'
			joins = []
			order = {}

			if params.has_key? :view
				order[:view_count] = params[:view]
			end

			if params.has_key? :interact
				order[:updated_at] = params[:interact]
			end

			if params.has_key? :id
				order[:id] = params[:id]
			end

			if params[:keyword].present?
				search(params[:keyword]).joins(joins).where(where).order(order)
			else
				joins(joins).where(where).order(order)
			end
		end

		def self.manager_search_with_params params = {}
			where = 'is_pending = false'
			joins = []
			order = {}

			if params.has_key? :view
				order[:view_count] = params[:view]
			end

			if params.has_key? :interact
				order[:updated_at] = params[:interact]
			end

			if params.has_key? :favorite
				order[:is_favorite] = params[:favorite]
			end

			if params.has_key? :id
				order[:id] = params[:id]
			end

			if params[:keyword].present?
				search(params[:keyword]).joins(joins).where(where).order(order)
			else
				joins(joins).where(where).order(order)
			end
		end

		# Current user favorite
		def get_is_current_user_favorite
			return false unless User.signed?

			return UsersFavoriteProject.exists? project_id: id, user_id: User.current.id
		end
		def is_current_user_favorite
			@is_current_user_favorite ||= get_is_current_user_favorite
		end

		# / Search with params

	# / Get

	# Helper

		# Get fields

		def self.get_fields p
			[]
		end

		# / Get fields

		# Get meta search

		def assign_meta_search
			tempLocale = I18n.locale
			I18n.locale = 'vi'

			assign_attributes meta_search_1: "#{display_id} #{id} #{district.name.gsub('Quận', '') if district.present?} #{street.name if street.present?} #{project_name}", meta_search_2: "#{province.name if province.present?} #{investor.name if investor.present?}", meta_search_3: "#{slogan} #{user.full_name + ' ' + user.email + ' ' + user.phone_number if user.present?} #{I18n.t('project_type.text.' + project_type.name) if project_type.present?}"

			I18n.locale = tempLocale
		end

		# / Get meta search

	# / Helper

	# Attributes

		# ID
		def display_id
			@id ||= ApplicationHelper.id_format id, 'PR'
		end

		# Slug
		def full_slug
			@full_slug ||= "#{slug}-#{id}"
		end

		# Full address
		def display_address
			@display_address ||= "#{address_number} #{street.name unless street.nil?}#{', ' + ward.name unless ward.nil?}#{', ' + district.name unless district.nil?}#{', ' + province.name unless province.nil?}".gsub(/\b\w/) { $&.capitalize }
		end

		# Description
		def display_description
			@display_description ||= (description.present? ? description.html_safe : nil)
		end

		# Position description
		def display_position_description
			@display_position_description ||= (position_description.present? ? position_description.html_safe : nil)
		end

		# Payment method
		def display_payment_method
			@display_payment_method ||= (payment_method.present? ? payment_method.html_safe : nil)
		end

		# Deadline
		def get_string_date date
			if date.present?
				case date_display_type
				when 1
					date = date.strftime '%d/%m/%Y'
				when 2
					case date.month
					when (1..3)
						date = 'Quý 1 năm ' + date.year.to_s
					when (4..6)
						date = 'Quý 2 năm ' + date.year.to_s
					when (7..9)
						date = 'Quý 3 năm ' + date.year.to_s
					when (10..12)
						date = 'Quý 4 năm ' + date.year.to_s
					end
				when 3
					date = 'Năm ' + date.year.to_s
				end
			end

			if date.blank?
				date = ''
			end

			date
		end

		def get_deadline
			date = nil
			if finished_base_date.present?
				date = finished_base_date
			elsif transfer_date.present?
				date = transfer_date
			elsif docs_issue_date.present?
				date = docs_issue_date
			elsif estimate_finishing_date.present?
				date = estimate_finishing_date
			end

			# get_string_date date
			if !date.nil? && DateTime.now > date
				true
			else
				false
			end
		end

		def display_deadline
			@display_deadline ||= get_deadline
		end

		# Unit price
		def get_unit_price
			if unit_price_text.present?
				(unit_price_text + (currency.code != 'VND' ? ' ' + currency.name : '') + I18n.t('unit.text.display_' + price_unit.name)).html_safe
			else
				'Giá thỏa thuận'
			end
		end

		def display_unit_price
			@display_unit_price ||= get_unit_price
		end

	# / Attributes

end