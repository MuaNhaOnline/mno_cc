=begin
	
	Attributes
		create_step:
			1: basic
			2: details
			3: interact
			4: ok
=end

class Project < ActiveRecord::Base

	# PgSearch

		include PgSearch
		pg_search_scope :search, against: [
			:meta_search_1,
			:id,
			:project_name,
			:description
		]

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

		has_many :images, class_name: 'ProjectImage', dependent: :destroy, autosave: true
		has_many :payment_attachments, class_name: 'ProjectPaymentAttachment', dependent: :destroy
		has_many :users_favorite_projects, class_name: 'UsersFavoriteProject'
		has_many :blocks, dependent: :destroy
		has_many :utilities, class_name: 'ProjectUtility', dependent: :destroy, autosave: true
		has_many :region_utilities, class_name: 'ProjectRegionUtility', dependent: :destroy, autosave: true

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

	# Save

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
			params[:constructional_area] = ApplicationHelper.format_f params[:constructional_area] if params.has_key? :constructional_area

			# Constructional quality
			if params.has_key? :using_ratio
				using_ratio = ApplicationHelper.format_f(params[:using_ratio]).to_f
				params[:using_ratio] = using_ratio < 0 ? 0 : (using_ratio > 100 ? 100 : using_ratio)
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

			# Logo
			if params[:logo].present?
				_value = JSON.parse params[:logo]

				if _value['is_new']
					TemporaryFile.get_file(_value['id']) do |_logo|
						assign_attributes logo: _logo
					end
				end
			else
				assign_attributes logo: nil
			end
			if params[:full_logo].present?
				_value = JSON.parse params[:full_logo]

				if _value['is_new']
					TemporaryFile.get_file(_value['id']) do |_logo|
						assign_attributes full_logo: _logo
					end
				end
			else
				assign_attributes full_logo: nil
			end

			# Cover image
			if params[:cover_image].present?
				_value = JSON.parse params[:cover_image]

				if _value['is_new']
					TemporaryFile.get_file(_value['id']) do |_image|
						assign_attributes cover_image: _image
					end
				end
			else
				assign_attributes full_logo: nil
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

							_images << _image
						end
					end
				end
				_utility.images = _images

				_utilities << _utility
			end
			assign_attributes utilities: _utilities

			# Region utilities
			_utilities = []
			params[:region_utilities].each_value do |_value|
				_utility = _value[:id].present? ? ProjectRegionUtility.find(_value[:id]) : ProjectRegionUtility.new

				_utility.title = _value[:title]
				_utility.description = ApplicationHelper.encode_plain_text(_value[:description])

				_images = []
				if _value[:images].present?
					_value[:images].each do |_v|
						_v = JSON.parse _v

						if _v['is_new']
							TemporaryFile.get_file(_v['id']) do |_image|
								_images << ProjectRegionUtilityImage.new(image: _image, order: _v['order'], description: _v['description'])
							end
						else
							_image = ProjectRegionUtilityImage.find _v['id']
							_image.description = _v['description']
							_image.order = _v['order']        

							_images << _image
						end
					end
				end
				_utility.images = _images

				_utilities << _utility
			end
			assign_attributes region_utilities: _utilities

			assign_attributes params.permit [
				:project_name, :slogan, :description, :unit_price, :unit_price_text, :currency_id, :payment_method, 
				:price_unit_id, :position_description,
				:lat, :long, :address_number, :province_id, :district_id, :ward_id, :street_id, 
				:project_type_id, :campus_area, :constructional_area, :is_draft,
				:using_ratio, :estimate_starting_date, :estimate_finishing_date,
				:starting_date, :finished_base_date, :transfer_date, :docs_issue_date,
				:unit_description,:user_id, :date_display_type, :main_color
			]
		end

		# Save with params

		def save_with_params _params, _is_draft = false
			# Author
			assign_attributes investor_id: _params[:investor_id]
			if new_record?
				return { status: 6 } if User.current.cannot? :create, self
			else
				return { status: 6 } if User.current.cannot? :edit, self
			end

			assign_attributes_with_params _params

			other_params = {
				is_draft: _is_draft,
				is_pending: true,
				slug: ApplicationHelper.to_slug(ApplicationHelper.de_unicode(self.project_name))
			}

			assign_attributes other_params

			if _is_draft
				if create_step < 1
					assign_attributes create_step: 1
				end
			else
				if create_step < 2
					assign_attributes create_step: 2
				end
			end

			assign_meta_search

			_is_new_record = new_record?

			if save validate: !_is_draft
				{ status: 0 }
			else 
				{ status: 3 }
			end
		end

		# / Save with params

		# Update show status

		def self.update_show_status id, is_show
			project = find id

			# Author
			return { status: 6 } if User.current.cannot? :edit, project

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
			return { status: 6 } if User.current.cannot? :manage, Project

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
			return { status: 6 } if User.current.cannot? :manage, project

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
			return { status: 6 } if User.current.cannot? :manage, project

			project.is_favorite = is_favorite

			if project.save validate: false
				{ status: 0 }
			else
				{ status: 2 }
			end
		end

		# / Update favorite status

		# Set product status
		
			def self.set_product_status id, product_type, product_id, product_status
				if product_type == 'real_estate'
					if RealEstate.joins(block: :project).where("projects.id = #{id} AND real_estates.id = #{product_id}").update_all(status: product_status)
						{ status: 0 }
					else
						{ status: 2 }
					end
				elsif product_type == 'floor_real_estate'
					if FloorRealEstate.joins(real_estate: { block: :project }).where("projects.id = #{id} AND floor_real_estates.id = #{product_id}").update_all(status: product_status)
						{ status: 0 }
					else
						{ status: 2 }
					end
				end
			end
		
		# / Set product status

	# / Save

	# Delete
		
		def self.delete_by_id id
			project = find id

			# Author
			return { status: 6 } if User.current.cannot? :delete, project

			_user_id = project.user_id

			if destroy id
				{ status: 0 }
			else
				{ status: 2 }
			end
		end

	# / Delete

	# Get

		# params: 
		#   keyword, page, price(x;y), district, price_from, price_to, currency_unit, unit
		#   newest
		def self.search_with_params params = {}
			where = 'is_pending = false AND is_show = true AND is_force_hide = false'
			joins = []
			order = {}

			# if params[:project].present?
			# 	return where(id: params[:project])
			# end

			# Price
			# if params.has_key? :price
			# 	price_range = params[:price].split(';')
			# 	where += " AND unit_price IS NOT NULL AND unit_price BETWEEN #{price_range[0]} AND #{price_range[1]}"
				
			# 	order[:unit_price] = 'asc'
			# end

			# Price range
			# if params[:price_from].present? || params[:price_to].present?
			# 	# Format number
			# 	params[:price_from] = ApplicationHelper.format_f(params[:price_from]).to_f * 1000000000 if params[:price_from].present?
			# 	params[:price_to] = ApplicationHelper.format_f(params[:price_to]).to_f * 1000000000 if params[:price_to].present?

			# 	if params[:price_from].present? && params[:price_to].present? && params[:price_from] > params[:price_to]
			# 		temp = params[:price_from]
			# 		params[:price_from] = params[:price_to]
			# 		params[:price_to] = temp
			# 	end

			# 	where += " AND unit_price >= #{params[:price_from]}" if params[:price_from].present?
			# 	where += " AND unit_price <= #{params[:price_to]}" if params[:price_to].present?
			# end

			# District
			if params[:district].present?
				joins << :district
				where += " AND districts.id = #{params[:district]} "
			end

			# Favorite
			if params.has_key? :is_favorite
				where += " AND is_favorite = #{params[:is_favorite]}"
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

		# params:
		# 	id, label, block_id, floor_id, group_id
		def self.product_search_with_params params = {}
			res = []
			floor_res = []

			# If have label => just find with label
			if params[:label].present?
				params[:label] = params[:label].gsub(/\s*,\s*/, ',').split(',')

				res = RealEstate.joins(block: :project).where(short_label: nil).where("projects.id = #{params[:id]}").where(label: params[:label])
				floor_res = FloorRealEstate.joins(real_estate: { block: :project }).where("projects.id = #{params[:id]}").where(label: params[:label])
			else
				res_joins = [{ block: :project }]
				floor_res_joins = [{ real_estate: { block: :project } }]
				where = "projects.id = #{params[:id]}"

				if params[:block_id].present?
					where += " AND blocks.id = #{params[:block_id]}"
				end

				if params[:floor_id].present?
					res_joins << :block_floor
					floor_res_joins << { real_estate: :block_floor }
					where += " AND block_floors.id = #{params[:floor_id]}"
				end

				if params[:group_id].present?
					res_joins << :block_group
					floor_res_joins << { real_estate: :block_group }
					where += " AND block_real_estate_groups.id = #{params[:group_id]}"
				end

				res = RealEstate.where(short_label: nil).joins(res_joins).where(where)
				floor_res = FloorRealEstate.joins(floor_res_joins).where(where)
			end

			{
				real_estates: res,
				floor_real_estates: floor_res
			}
		end

		# Current user favorite
		def get_is_current_user_favorite
			return false unless User.signed?

			return UsersFavoriteProject.exists? project_id: id, user_id: User.current.id
		end
		def is_current_user_favorite
			@is_current_user_favorite ||= get_is_current_user_favorite
		end

	# / Get

	# Helper

		# Get fields

		def self.get_fields p
			[]
		end

		# / Get fields

		# Get meta search

		def assign_meta_search
			assign_attributes meta_search_1: "#{display_id}"
			
			# tempLocale = I18n.locale
			# I18n.locale = 'vi'

			# assign_attributes meta_search_1: "#{display_id} #{id} #{district.name.gsub('Quận', '') ì district.present?Ư #{street.name ì street.present?Ư #{project_name}", meta_search_2: "#{province.name ì province.present?Ư #{investor.name ì investor.present?Ư", meta_search_3: "#{slogan} #{user.full_name + ' ' + ủe.email + ' ' + ủe.phone_number ì ủe.present?Ư #ƠI18n.t('project_type.tẽt.' + project_type.name) ì project_type.present?Ư"

			# I18n.locale = tempLocale
		end

		# / Get meta search

	# / Helper

	# Attributes

		# Logo
		has_attached_file :logo,
			default_url: "/assets/projects/:style/default.png", 
  			styles: { medium: '400x200' },
			:path => ":rails_root/app/assets/file_uploads/project_logos/:style/:id_:filename", 
			:url => "/assets/project_logos/:style/:id_:filename"
		validates_attachment_content_type :logo, content_type: /\Aimage\/.*\Z/
		has_attached_file :full_logo,
  			styles: { medium: '400x200' },
			default_url: "/assets/projects/:style/default.png", 
			:path => ":rails_root/app/assets/file_uploads/project_full_logos/:style/:id_:filename", 
			:url => "/assets/project_full_logos/:style/:id_:filename"
		validates_attachment_content_type :full_logo, content_type: /\Aimage\/.*\Z/
		has_attached_file :cover_image,
			default_url: "/assets/projects/:style/default.png", 
			:path => ":rails_root/app/assets/file_uploads/project_cover_images/:style/:id_:filename", 
			:url => "/assets/project_cover_images/:style/:id_:filename"
		validates_attachment_content_type :cover_image, content_type: /\Aimage\/.*\Z/

		# ID
		def display_id
			@id ||= ApplicationHelper.id_format id, 'PR'
		end

		# Slug
		def full_slug
			@full_slug ||= "#{slug}-#{id}"
		end

		# Project type
		def display_project_type
			@display_project_type ||= project_type.present? ? I18n.t("project_type.text.#{project_type.name}") : ''
		end

		# Address
		def display_short_address
			@display_address ||= "#{street.name unless street.nil?}#{', ' + district.name unless district.nil?}#{', ' + province.name unless province.nil?}".gsub(/\b\w/) { $&.capitalize }
		end
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

		# Area
		def display_campus_area
			@display_campus_area ||= campus_area.present? ? ApplicationHelper.display_number(ApplicationHelper.display_decimal(campus_area)) : ''
		end
		def display_constructional_area
			@display_constructional_area ||= constructional_area.present? ? ApplicationHelper.display_number(ApplicationHelper.display_decimal(constructional_area)) : ''
		end

		# Using ratio
		def display_using_ratio
			@display_using_ratio ||= using_ratio.present? ? ApplicationHelper.display_decimal(using_ratio) : ''
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
		def display_unit_price
			@display_unit_price ||=
				unit_price_text.present? ?
					(unit_price_text + (currency.code != 'VND' ? ' ' + currency.name : '') + I18n.t('unit.text.display_' + price_unit.name)).html_safe
				:
					''
		end

	# / Attributes

end