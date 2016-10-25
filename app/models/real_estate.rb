=begin
	attributes:
		status: enum(available, unavailable, sold)

	
=end


class RealEstate < ActiveRecord::Base

	# Callback
	
		after_save :pg_search_update
	
	# / Callback

	# Constant
		
		# Street type
		PRIVATE_STREET 	=	1
		PUBLIC_STREET 	=	2
		# Shape
		NORMAL_SHAPE 	=	0
		LESS_SHAPE 		=	1
		GREATER_SHAPE 	=	2
		# Quality
		BEST_QUALITY	=	4
		NEW_QUALITY		=	3
		NORMAL_QUALITY	=	2
		LOW_QUALITY		=	1

	# / Constant

	# PgSearch

		has_one :searchable, class_name: 'SearchableRealEstate'

		include PgSearch
		pg_search_scope :pg_search, lambda { |query, fields = nil|
			{
				associated_against: {
					searchable: fields || {
						:real_estate_id			=>	'A',
						:real_estate_display_id	=>	'A',
						:real_estate_type		=>	'A',
						:address				=>	'A',
						:title 					=>	'D',
						:description 			=>	'D'
					}
				},
				query: query
			}
		}
		# pg_search_scope :pg_search,
		# 	associated_against: {
		# 		searchable: {
		# 			:real_estate_id			=>	'A',
		# 			:real_estate_display_id	=>	'A',
		# 			:real_estate_type		=>	'A',
		# 			:address				=>	'A',
		# 			:title 					=>	'D',
		# 			:description 			=>	'D'
		# 		}
		# 	}
		# pg_search_scope :pg_address_sort,
		# 	associated_against: {
		# 		searchable: {
		# 			:real_estate_id			=>	'D',
		# 			:real_estate_display_id	=>	'D',
		# 			:real_estate_type		=>	'D',
		# 			:address				=>	'A',
		# 			:title 					=>	'D',
		# 			:description 			=>	'D'
		# 		}
		# 	},
		# 	using: {
		# 		:tsearch => {:any_word => true},
		# 		:dmetaphone => {:any_word => true, :sort_only => true}
		# 	}

		def pg_search_update
			keys = self.previous_changes.keys

			self.searchable ||= build_searchable(real_estate_display_id: display_id.downcase)
			self.searchable.address 			= 	ApplicationHelper.deunicode(self.display_short_address).downcase if keys.include?(:street_id) || keys.include?(:district_id) || keys.include?(:province_id)
			self.searchable.real_estate_type 	= 	ApplicationHelper.deunicode(self.display_real_estate_type).downcase if keys.include?(:real_estate_type_id)
			self.searchable.title 				= 	ApplicationHelper.deunicode(self.title).downcase if keys.include?(:title)
			self.searchable.description 		= 	ApplicationHelper.deunicode(ActionView::Base.full_sanitizer.sanitize(self.description)).downcase if keys.include?(:description)

			self.searchable.save if self.searchable.changed?
		end

		def pg_search_force_update
			if searchable.blank?
				build_searchable
			end
			searchable.real_estate_display_id 	= 	display_id.downcase
			searchable.address 					= 	ApplicationHelper.deunicode(display_short_address).downcase
			searchable.real_estate_type 		= 	ApplicationHelper.deunicode(display_real_estate_type).downcase
			searchable.title 					= 	ApplicationHelper.deunicode(title).downcase
			searchable.description 				= 	ApplicationHelper.deunicode(ActionView::Base.full_sanitizer.sanitize(description)).downcase

			searchable.save if searchable.changed?
		end

		def self.pg_search_force_update_all
			find_each do |re|
				re.pg_search_force_update
			end
		end

	# / PgSearch

	# Solr
	
		searchable do
			integer		:id
			text 		:display_id, :default_boost => 3.0 do
							self.display_id + ' ' + self.display_id(true)
						end
			text 		:title
			text 		:description
			text 		:address, :default_boost => 2.0 do 
							self.display_short_address
						end
			text 		:real_estate_type, :default_boost => 2.0 do
							self.display_real_estate_type
						end 

			boolean		:is_pending
			boolean 	:is_show
			boolean 	:is_force_hide
			boolean 	:is_favorite
			integer		:block_real_estate_group_id
			integer		:purpose_id
			string		:purpose_code do
							self.purpose.code if self.purpose.present?
						end
			integer		:real_estate_type_id
			integer		:province_id
			integer		:district_id
			double		:rent_price
			double		:sell_price
			double		:area do
							self.display_area
						end
			time		:created_at
			integer		:region_utility_ids, multiple: true
			integer		:user_id
		end
	
	# / Solr

	# Associations

		has_one :owner_info, class_name: 'RealEstateOwner', autosave: true

		belongs_to :user
		belongs_to :contact_user, class_name: 'ContactUserInfo', foreign_key: 'user_id'
		belongs_to :real_estate_type
		belongs_to :street
		belongs_to :ward
		belongs_to :district
		belongs_to :province
		belongs_to :currency
		belongs_to :purpose
		belongs_to :sell_unit, class_name: 'Unit'
		belongs_to :rent_unit, class_name: 'Unit'
		belongs_to :legal_record_type
		belongs_to :planning_status_type
		belongs_to :constructional_level
		belongs_to :direction
		belongs_to :block
		belongs_to :block_group, class_name: 'BlockRealEstateGroup', foreign_key: 'block_real_estate_group_id'
		belongs_to :block_floor

		has_many :images, class_name: 'RealEstateImage', dependent: :destroy, autosave: true
		has_many :appraisal_companies_real_estates
		has_many :appraisal_companies, through: :appraisal_companies_real_estates
		has_many :assigned_appraisal_companies, -> { where('appraisal_companies_real_estates.is_assigned' => true) }, through: :appraisal_companies_real_estates,
			source: :appraisal_company,
			class_name: 'AppraisalCompany'
		has_many :users_favorite_real_estates, class_name: 'UsersFavoriteRealEstate'
		has_many :in_floors, class_name: 'FloorRealEstate', dependent: :destroy, autosave: true
		has_many :available_in_floors, -> { where('floor_real_estates.status = \'available\'') }, class_name: 'FloorRealEstate'

		has_and_belongs_to_many :property_utilities, dependent: :destroy
		has_and_belongs_to_many :region_utilities, dependent: :destroy
		has_and_belongs_to_many :advantages, dependent: :destroy
		has_and_belongs_to_many :disadvantages, dependent: :destroy

	# / Associations

	# Validations

		validate :custom_validate

		def custom_validate
			return if is_draft
			
			if block_real_estate_group_id.present?
				return
			end

			# Reload fields
			fields true
			
			# Purpose
			if fields.include?(:purpose) && purpose.blank?
				errors.add :purpose, 'Mục đích không thể bỏ trống'
				return
			end

			# Currency
			if fields.include?(:currency) && currency.blank?
				errors.add :currency, 'Loại tiền tệ không thể bỏ trống'
				return
			end

			# Unit
			if fields.include?(:sell_unit) && sell_price.present? && sell_unit.blank?
				errors.add :sell_unit, 'Đơn vị tính giá bán không thể bỏ trống'
				return
			end
			if fields.include?(:rent_unit) && rent_price.present? && rent_unit.blank?
				errors.add :rent_unit, 'Đơn vị tính giá cho thuê không thể bỏ trống'
				return
			end

			# Location
			if fields.include?(:province) && province.blank?
				errors.add :province, 'Tỉnh/thành phố không thể bỏ trống'
				return
			end
			if fields.include?(:district) && district.blank?
				errors.add :district, 'Quận không thể bỏ trống'
				return
			end
			if fields.include?(:street) && street.blank?
				errors.add :street, 'Đường không thể bỏ trống'
				return
			end

			# Street_type
			if fields.include?(:street_type) && street_type.blank?
				errors.add :street_type, 'Loại đường không thể bỏ trống'
				return
			end

			# Alley
			if fields.include?(:is_alley) && is_alley.nil?
				errors.add :is_alley, 'Mặt đường không thể bỏ trống'
				return
			end
			if fields.include?(:alley_width) && alley_width.blank?
				errors.add :alley_width, 'Độ rộng hẻm không thể bỏ trống'
				return
			end

			# Type
			if fields.include?(:real_estate_type) && real_estate_type.blank?
				errors.add :real_estate_type, 'Loại bất động sản không thể bỏ trống'
				return
			end

			# Building name
			if fields.include?(:building_name) && building_name.blank?
				errors.add :building_name, 'Tên tòa nhà không thể bỏ trống'
				return
			end

			# Area
			if fields.include?(:constructional_area) && constructional_area.blank?
				errors.add :constructional_area, 'Diện tích xây dựng không thể bỏ trống'
				return
			end
			if fields.include?(:using_area) && using_area.blank?
				errors.add :using_area, 'Diện tích sử dụng không thể bỏ trống'
				return
			end
			if fields.include?(:campus_area) && campus_area.blank?
				errors.add :campus_area, 'Diện tích khuôn viên không thể bỏ trống'
				return
			end

			# Width
			# if fields.include?(:width_x) && width_x.blank?
			#   errors.add :width_x, 'Chiều ngang không thể bỏ trống'
			#   return
			# end
			# if fields.include?(:width_y) && width_y.blank?
			#   errors.add :width_y, 'Chiều dài không thể bỏ trống'
			#   return
			# end

			# Shape
			if fields.include?(:shape) && shape.blank?
				errors.add :shape, 'Hình dáng không thể bỏ trống'
				return
			end
			if fields.include?(:shape_width) && shape_width.blank?
				errors.add :shape_width, 'Kích thước mặt hậu không thể bỏ trống'
				return
			end

			# Number of ...
			# if fields.include?(:floor_number) && floor_number.blank?
			#   errors.add :floor_number, 'Tầng không thể bỏ trống'
			#   return
			# end
			if fields.include?(:restroom_number) && restroom_number.blank?
				errors.add :restroom_number, 'Số phòng tắm không thể bỏ trống'
				return
			end
			if fields.include?(:bedroom_number) && bedroom_number.blank?
				errors.add :bedroom_number, 'Số phòng ngủ không thể bỏ trống'
				return
			end

			# Direction
			if fields.include?(:direction) && direction.blank?
				errors.add :direction, 'Hướng không thể bỏ trống'
				return
			end

			# Constructional level
			if fields.include?(:constructional_level) && constructional_level.blank?
				errors.add :constructional_level, 'Loại nhà không thể bỏ trống'
				return
			end

			# Build year
			if fields.include?(:build_year) && build_year.blank?
				errors.add :build_year, 'Năm xây dựng không thể bỏ trống'
				return
			end

			# Constructional level
			if fields.include?(:constructional_level) && constructional_level.blank?
				errors.add :constructional_level, 'Loại nhà không thể bỏ trống'
				return
			end


			# Constructional quality
			if fields.include?(:constructional_quality) && constructional_quality.blank?
				errors.add :constructional_quality, 'Hiện trạng không thể bỏ trống'
				return
			end

			# Title
			if fields.include?(:title) && title.blank?
				errors.add :title, 'Tiêu đề không thể bỏ trống'
				return
			end

			# Description
			if fields.include?(:description) && description.blank?
				errors.add :description, 'Mô tả không thể bỏ trống'
				return
			end

			# Legal record type
			if fields.include?(:legal_record_type)
				if legal_record_type.blank? && legal_record_type_id != 0
					errors.add :legal_record_type, 'Hồ sơ pháp lý không thể bỏ trống'
					return
				end
				if fields.include?(:custom_legal_record_type) && custom_legal_record_type.blank?
					errors.add :custom_legal_record_type, 'Hồ sơ pháp lý không thể bỏ trống'
					return
				end
			end

			# Planning status type
			if fields.include?(:planning_status_type)
				if planning_status_type.blank? && planning_status_type_id != 0
					errors.add :planning_status_type, 'Tình trạng quy hoạch không thể bỏ trống'
					return
				end
				if fields.include?(:custom_planning_status_type) && custom_planning_status_type.blank?
					errors.add :custom_planning_status_type, 'Tình trạng quy hoạch không thể bỏ trống'
					return
				end
			end
		end

	# / Validations

	# Insert

		# Assign with params

			def assign_attributes_with_params params
				# Description
				# if params.has_key? :description
				#   params[:description] = ApplicationHelper.encode_plain_text params[:description]
				# end

				# Get price
				if params.has_key? :sell_price
					params[:sell_price] = ApplicationHelper.format_i params[:sell_price]
					params[:sell_price_text] = ApplicationHelper.read_money params[:sell_price]
				end
				if params.has_key? :rent_price
					params[:rent_price] = ApplicationHelper.format_i(params[:rent_price])
					params[:rent_price_text] = ApplicationHelper.read_money params[:rent_price]
				end

				# Alley width
				params[:alley_width] = ApplicationHelper.format_f params[:alley_width] if params.has_key? :alley_width

				# Area
				params[:constructional_area] = ApplicationHelper.format_f params[:constructional_area] if params.has_key? :constructional_area
				params[:using_area] = ApplicationHelper.format_f params[:using_area] if params.has_key? :using_area
				params[:campus_area] = ApplicationHelper.format_f params[:campus_area] if params.has_key? :campus_area
				params[:garden_area] = ApplicationHelper.format_f params[:garden_area] if params.has_key? :garden_area
				params[:width_x] = ApplicationHelper.format_f params[:width_x] if params.has_key? :width_x
				params[:width_y] = ApplicationHelper.format_f params[:width_y] if params.has_key? :width_y

				# Location
				if params[:province].present?
					if params[:province] == 'Hồ Chí Minh'
						params[:province] = 'Tp. Hồ Chí Minh'
					end
					province = Province.find_or_create_by name: params[:province]
					params[:province_id] = province.id
				end
				if params[:district].present? && params[:province_id].present?
					district = District.find_or_create_by name: params[:district], province_id: params[:province_id]
					params[:district_id] = district.id
				end
				if params[:ward].present? && params[:district_id].present?
					ward = Ward.find_or_create_by name: params[:ward], district_id: params[:district_id]
					params[:ward_id] = ward.id
				end
				if params[:street].present? && params[:district_id].present?
					street = Street.find_or_create_by name: params[:street], district_id: params[:district_id]
					params[:street_id] = street.id
				end

				# Advantages, disavantage, property utility, region utility
				params[:advantage_ids] = [] unless params.has_key? :advantage_ids
				params[:disadvantage_ids] = [] unless params.has_key? :disadvantage_ids
				params[:property_utility_ids] = [] unless params.has_key? :property_utility_ids
				params[:region_utility_ids] = [] unless params.has_key? :region_utility_ids

				# Images
				_images = []
				_has_avatar = false
				if params[:images].present?
					params[:images].each do |_v|
						_value = JSON.parse _v
						_value['is_avatar'] ||= false

						if _value['is_new']
							TemporaryFile.get_file(_value['id']) do |_image|
								_images << RealEstateImage.new(image: _image, is_avatar: _value['is_avatar'], order: _value['order'], description: _value['description'])

								_has_avatar = true if _value['is_avatar']
							end
						else
							_image = RealEstateImage.find _value['id']
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

				assign_attributes params.permit [
					:is_full, :is_draft,
					:title, :description, :purpose_id, :sell_price, :sell_price_text, :rent_price, :rent_price_text, 
					:currency_id, :sell_unit_id, :rent_unit_id, :is_negotiable, :province_id, :district_id, :ward_id, :street_id, 
					:address_number, :street_type, :is_alley, :real_estate_type_id, :building_name,
					:legal_record_type_id, :planning_status_type_id, :custom_advantages, :custom_disadvantages,
					:alley_width, :shape_width, :custom_legal_record_type, :custom_planning_status_type, :is_draft,
					:lat, :lng, :user_type, :user_id, :appraisal_purpose, :appraisal_type, :campus_area, :using_area, :constructional_area, :garden_area,
					:shape, :shape_width, :bedroom_number, :build_year, :constructional_level_id, :restroom_number,
					:width_x, :width_y, :floor_number, :constructional_quality, :direction_id, :block_id,
					advantage_ids: [], disadvantage_ids: [], property_utility_ids: [], region_utility_ids: []
				]
			end

		# / Assign with params

		# Save with params

			def save_with_params re_params, params = {}
				# Params
				return { status: 7 } if !params.has_key? :new_record?

				assign_attributes_with_params re_params

				other_params = {
					is_pending: true,
					slug: ApplicationHelper.to_slug(ApplicationHelper.deunicode(self.name))
				}

				if user_type == 'contact_user' && params[:new_record?]
					other_params[:is_active] = false
					other_params[:params] ||= {}
					other_params[:params]['secure_code'] = SecureRandom.base64
				end

				unless params[:new_record?]
					other_params[:zoho_is_changed] = true
				end

				assign_attributes other_params

				assign_meta_search

				if save validate: !is_draft
					{ status: 0 }
				else 
					{ status: 3, result: errors.full_messages }
				end
			end

		# / Save with params

		# Block assign with params

			def block_assign_with_params params

				# Short label

					if Block.find(params[:block_id]).has_floor
						if label != params[:label]
							_short_label = params[:label]
							_f_index = _short_label =~ /\{f.*\}/
							if _f_index.present?
								_short_label = _short_label.gsub /\{f.*\}/, ''

								# First position => Check if right 1 (= current position because was deleted)
								if _f_index == 0
									_short_label[0] = '' if _short_label[0] =~ /[^a-zA-Z0-9]/
								# Last position => Check left 1
								elsif _f_index == _short_label.length
									_short_label[_f_index - 1] = '' if _short_label[_f_index - 1] =~ /[^a-zA-Z0-9]/
								# If middle & If left 1, right 1 (= current position because was deleted) is [a-zA-Z0-9] => remove left
								else
									_short_label[_f_index - 1] = '' if _short_label[_f_index - 1] =~ /[^a-zA-Z0-9]/ && _short_label[_f_index] =~ /[^a-zA-Z0-9]/
								end
							end

							assign_attributes short_label: _short_label
						end
					else
						assign_attributes short_label: nil
					end

				# / Short label

				# Floor infos

					if params[:floors].present?

						_floor_infos_text = []

						params[:floors].each_value do |_value_params|
							_hash = {}

							_hash['floors'] = _value_params[:floors] if _value_params[:floors].present?
							_hash['sell_price'] = ApplicationHelper.format_i(_value_params[:sell_price]) if _value_params[:sell_price].present?
							_hash['sell_floor_coefficient'] = _value_params[:sell_floor_coefficient] if _value_params[:sell_floor_coefficient].present?
							_hash['rent_price'] = ApplicationHelper.format_i(_value_params[:rent_price]) if _value_params[:rent_price].present?
							_hash['rent_floor_coefficient'] = _value_params[:rent_floor_coefficient] if _value_params[:rent_floor_coefficient].present?

							_floor_infos_text << _hash
						end

						assign_attributes floor_infos_text: _floor_infos_text
						
					end

				# / Floor infos

				assign_attributes params.permit [
					:label, :block_id, :block_real_estate_group_id, :block_floor_id
				]

			end

		# / Block assign with params

		# Block save with params

			def block_save_with_params params
				assign_attributes_with_params params

				block_assign_with_params params[:block]

				other_params = {
					is_full: true,
					is_pending: true
				}

				other_params[:status] = 'unavailable' if self.new_record?

				assign_attributes other_params

				if block_floor_id_changed?
					_re_descriptions = BlockFloorSurfaceRealEstateDescription.where real_estate_id: id

					_re_descriptions.each do |_re_description|
						BlockFloorSurfaceDescription.where(id: _re_description.block_floor_surface_description_id).update_all(description_type: nil)
					end
				end

				if save validate: false
					{ status: 0 }
				else 
					{ status: 3, result: errors.full_messages }
				end
			end

		# / Block save with params

		# Build in floor

			def build_in_floors

				_in_floors = []

				def _parseFloors string
					# Format
					string = string.gsub(/[^0-9\-,]/, '')

					list = []
					string.split(',').each do |s|
						# remove redundancy
						value = s.gsub(/\-.*\-/, '-').split('-')

						# case: just a number
						if value.length == 1
							list << value[0].to_i
						# case: in range
						else 
							# case: full param
							if value[0].present? && value[1].present?
								value[0] = value[0].to_i
								value[1] = value[1].to_i

								# exchange for correct format (increase)
								if value[0] > value[1]
									temp = value[0]
									value[0] = value[1]
									value[1] = temp
								end

								(value[0]..value[1]).each do |v|
									list << v
								end
							# case: one in => same a number
							elsif value[0].present?
								list << value[0].to_i
							elsif value[1].present?
								list << value[1].to_i
							end
						end
					end
					
					list.uniq.sort
				end

				floor_infos_text.each do |_info|
					_parseFloors(_info['floors']).each do |_floor_number|
						_floor_info = FloorRealEstate.where(real_estate_id: id, floor: _floor_number).first_or_initialize(status: 'unavailable')

						_floor_info.label = label.gsub(/{f(:.*)*}/) do |match|
							match = match.split(':')
							next _floor_number if (match.count == 1)

							_strFloor = _floor_number.to_s
							match[1] = match[1].to_i
							if match[1].present?
								next _strFloor.rjust(match[1], '0')
							end
							next _floor_number
						end

						_floor_info.floor = _floor_number

						if _info['sell_price'].present?

							if _info['sell_floor_coefficient'].present?
								_coefficient = _info['sell_floor_coefficient']

								# Replace operator
								# x => *
								_coefficient = _coefficient.gsub(/x(?!(^{)*})/i, '*')
								# : => /
								_coefficient = _coefficient.gsub(/:(?!(^{)*})/, '/')
								# \D & operator => ''
								_coefficient = _coefficient.gsub(/[^\d\+\-\*\/\(\)\{\}](?!(^{)*})/, '')
								# ++ => +
								_coefficient = _coefficient.gsub(/\+[\+\-\*\/](?!(^{)*})/, '+')
								_coefficient = _coefficient.gsub(/\-[\+\-\*\/](?!(^{)*})/, '-')
								_coefficient = _coefficient.gsub(/\*[\+\-\*\/](?!(^{)*})/, '*')
								_coefficient = _coefficient.gsub(/\/[\+\-\*\/](?!(^{)*})/, '/')

								# Calc
								_floor_info.sell_price = eval(_coefficient.gsub('{f}', _floor_number.to_s).gsub('{p}', _info['sell_price'].to_s))
							else
								_floor_info.sell_price = _info['sell_price']
							end
					
							_floor_info.sell_price_text = ApplicationHelper.read_money _floor_info.sell_price
						end

						if _info['rent_price'].present?

							if _info['rent_floor_coefficient'].present?
								_coefficient = _info['rent_floor_coefficient']

								# Replace operator
								# x => *
								_coefficient = _coefficient.gsub(/x(?!(^{)*})/i, '*')
								# : => /
								_coefficient = _coefficient.gsub(/:(?!(^{)*})/, '/')
								# \D & operator => ''
								_coefficient = _coefficient.gsub(/[^\d\+\-\*\/\(\)\{\}](?!(^{)*})/, '')
								# ++ => +
								_coefficient = _coefficient.gsub(/\+[\+\-\*\/](?!(^{)*})/, '+')
								_coefficient = _coefficient.gsub(/\-[\+\-\*\/](?!(^{)*})/, '-')
								_coefficient = _coefficient.gsub(/\*[\+\-\*\/](?!(^{)*})/, '*')
								_coefficient = _coefficient.gsub(/\/[\+\-\*\/](?!(^{)*})/, '/')

								# Calc
								_floor_info.rent_price = eval(_coefficient.gsub('{f}', _floor_number.to_s).gsub('{p}', _info['rent_price'].to_s))
							else
								_floor_info.rent_price = _info['rent_price']
							end

							_floor_info.rent_price_text = ApplicationHelper.read_money _floor_info.rent_price
						end

						_floor_info.save
						_in_floors << _floor_info
					end
				end

				in_floor = _in_floors
				save
				label
			end

		# / Build in floor

	# / Insert

	# Get

		# Get by purpose

			def self.get_by_current_purpose
				purpose_condition = nil

				case User.options[:current_purpose]
				when 'r'
					purpose_condition = 'purposes.code = \'rent\' OR purposes.code = \'sell_rent\''
				else
					purpose_condition = 'purposes.code = \'sell\' OR purposes.code = \'sell_rent\''
				end
				joins(:purpose).where(purpose_condition)
			end

		# / Get by purpose

		# Get random

			def self.get_random
				order('RANDOM()')
			end

		# / Get random

		# Get favorite
		
			def self.get_favorite
				where(is_favorite: true)
			end
		
		# / Get favorite

		# Search with params

			def self.can_view_conditions
				'(is_pending = false AND is_show = true AND is_force_hide = false AND block_real_estate_group_id IS NULL)'
			end

			def self.list_conditions
				# search_obj.with :is_pending, false
				# search_obj.with :is_show, true
				# search_obj.with :is_force_hide, false
				self.where is_pending: false, is_show: true, is_force_hide: false, block_real_estate_group_id: nil
			end

			def self.my_favorite_list_conditions search_obj
				# return unless User.signed?

				# ids = UsersFavoriteRealEstate.of_current_user.order(created_at: :asc).pluck(:real_estate_id)

				# search_obj.with :id, ids
			end

			# params
			# 		conditions:
			# 			conditions_of(list, my_favorite_list)
			# 			except
			# 				ids
			# 			keyword
			# 			attributes...(is_favorite,real_estate_type,province,district,purpose)
			# 			price_from, price_to
			# 		params:
			# 			order(random,newest)
			# 			limit
			# 			paginate
			# 				page
			# 				per_page
			def self.search_with_params_2 conditions = {}, params = {}
				conditions.symbolize_keys! if conditions.respond_to? :symbolize_keys!
				params.symbolize_keys! if params.respond_to? :symbolize_keys!

				# Search if has keyword
				return self.search do 
					# Default
					conditions[:conditions_of] ||= 'list'
					if conditions[:conditions_of].class == String
						eval "RealEstate.#{conditions[:conditions_of]}_conditions self"
					else
						conditions[:conditions_of].call self
					end

					# Conditions
					if conditions.present?
						# Except
						
							if conditions[:except].present?
								if conditions[:except][:ids].present?
									without :id, conditions[:except][:ids]
								end
							end
						
						# / Except
						# Keyword
						
							if conditions[:keyword].present?
								keyword = ApplicationHelper.deunicode(conditions[:keyword])
									.downcase
									.gsub('hooc mon', 'hoc mon')
								keyword_arr = keyword.split ' '

								# Normal
								fulltext keyword

								# Address (quan/huyen)
								index = keyword_arr.index{ |v| ['quan', 'huyen'].include? v }
								# If exists && not last
								if index.present? && index != keyword_arr.count - 1
									# If next key is integer => get 'quan' + 1 word
									# Else => 2 words
									if keyword_arr[index + 1] =~ /\A\d+\Z/
										address_keyword = "\"quan #{keyword_arr[index + 1]}\""
									else
										address_keyword = "\"#{keyword_arr[index + 1]} #{keyword_arr[index + 2]}\""
									end

									fulltext(address_keyword) do
										fields :address
									end
								end
							end
						
						# / Keyword
						# Field

							with(:user_id, conditions[:user]) if conditions[:user].present?
							with(:is_favorite, conditions[:is_favorite]) if conditions.has_key? :is_favorite
							with(:real_estate_type_id, conditions[:real_estate_type]) if conditions[:real_estate_type].present?
							with(:province_id, conditions[:province]) if conditions[:province].present?
							with(:district_id, conditions[:district]) if conditions[:district].present?
							with(:region_utility_ids, conditions[:region_utility]) if conditions[:region_utility].present?
								
							# Purpose
							use_price = 'sell'
							if conditions[:purpose].present?
								if conditions[:purpose] =~ /\D/
									purpose = Purpose.where(code: conditions[:purpose]).first
								else
									purpose = Purpose.where(id: conditions[:purpose]).first
								end

								case purpose.code
								when 'sell_rent'
									with :purpose_code, ['sell', 'rent', 'sell_rent']
								when 'transfer'
									with :purpose_code, 'transfer'
									use_price = 'sell'
								else
									with :purpose_code, purpose.code
									use_price = purpose.code
								end if purpose.present?
							end

							# Price
							if conditions[:price_from].present? || conditions[:price_to].present?
								# Format price
								conditions[:price_from] = ApplicationHelper.format_f(conditions[:price_from]).to_f * 1000000 if conditions[:price_from].present?
								conditions[:price_to] = ApplicationHelper.format_f(conditions[:price_to]).to_f * 1000000 if conditions[:price_to].present?

								# Purpose
								purpose = conditions[:purpose_text]

								if conditions[:price_from].present? && conditions[:price_to].present?
									with("#{use_price}_price", conditions[:price_from]..conditions[:price_to])
								elsif conditions[:price_from].present?
									with("#{use_price}_price", conditions[:price_from]..(conditions[:price_from] * 2))
								else
									with("#{use_price}_price", (conditions[:price_to] * 0.5)..conditions[:price_to])
								end
							end

							# Area
							if conditions[:area_from].present? || conditions[:area_to].present?
								conditions[:area_from] = ApplicationHelper.format_f(conditions[:area_from]).to_f if conditions[:area_from].present?
								conditions[:area_to] = ApplicationHelper.format_f(conditions[:area_to]).to_f if conditions[:area_to].present?

								if conditions[:area_from].present? && conditions[:area_to].present?
									with('area', conditions[:area_from]..conditions[:area_to])
								elsif conditions[:area_from].present?
									with('area', conditions[:area_from]..(conditions[:area_from] * 2))
								else
									with('area', (conditions[:area_to] * 0.5)..conditions[:area_to])
								end
							end

						# / Field
					end

					# Order
					if params[:order].present?
						params[:order] = [ params[:order] ] unless params[:order].is_a? Array
						params[:order].map!{ |v| v.to_s }

						order_by(:random) if params[:order].include? :random
						order_by(:created_at, :desc) if params[:order].include? :newest
					end

					# Limit
					if params[:limit].present?
						paginate(
							page:		1,
							per_page: 	params[:limit]
						)
					end

					# Paginate
					if params[:paginate].present?
						paginate(
							page:		params[:paginate][:page] || 1, 
							per_page: 	params[:paginate][:per_page] || 12
						)
					end
				end
			end

			# args:
			# 	conditions:
			# 		conditions_of: 
			# 			default: list
			# 			value: enum(list,my_favorite_list)
			def self.search_with_params_3 conditions = {}, params = {}
				conditions 	= 	conditions.clone
				params 		= 	params.clone
				conditions.symbolize_keys! if conditions.respond_to? :symbolize_keys!
				params.symbolize_keys! if params.respond_to? :symbolize_keys!

				results = self

				# Default
				eval("results = results.#{conditions[:conditions_of] || 'list'}_conditions")

				# Except
				
					if conditions[:except].present?
						if conditions[:except][:ids].present?
							results = results.where.not(id: conditions[:except][:ids])
						end
					end
				
				# / Except

				# Fields
				
					results = results.where(user_id: conditions[:user]) if conditions[:user].present?
					results = results.where(is_favorite: conditions[:is_favorite]) if conditions[:is_favorite].present?
					results = results.where(real_estate_type_id: conditions[:real_estate_type]) if conditions[:real_estate_type].present?
					results = results.where(constructional_level_id: conditions[:constructional_level]) if conditions[:constructional_level].present?
					results = results.where(street_id: conditions[:street]) if conditions[:street].present?
					results = results.where(district_id: conditions[:district]) if conditions[:district].present?
					results = results.where(province_id: conditions[:province]) if conditions[:province].present?
					results = results.where(region_utility_id: conditions[:region_utility]) if conditions[:region_utility].present?

					price_using = 'sell'

					# Purpose
					if conditions[:purpose].present?
						if conditions[:purpose] =~ /\D/
							purpose = Purpose.where(code: conditions[:purpose]).first
						else
							purpose = Purpose.where(id: conditions[:purpose]).first
						end

						if purpose.present?
							purpose_code = ''
							case purpose.code
							when 'sell_rent'
								purpose_code = 'sell', 'rent', 'sell_rent'
							when 'transfer'
								purpose_code = 'sell'
							else
								purpose_code = price_using = purpose.code
							end

							results = results
								.joins(:purpose)
								.where(purposes: { code: purpose_code })
						end
					end

					# Price
					if conditions[:price_from].present? || conditions[:price_to].present?
						# Format price
						conditions[:price_from] = ApplicationHelper.format_f(conditions[:price_from]).to_f * 1000000 if conditions[:price_from].present?
						conditions[:price_to] = ApplicationHelper.format_f(conditions[:price_to]).to_f * 1000000 if conditions[:price_to].present?

						if conditions[:price_from].present? && conditions[:price_to].present?
							range = conditions[:price_from]..conditions[:price_to]
						elsif conditions[:price_from].present?
							range = conditions[:price_from]..(conditions[:price_from] * 2)
						else
							range = (conditions[:price_to] * 0.5)..conditions[:price_to]
						end

						results = results.where("#{use_price}_price": range)
					end

					# Area
					if conditions[:area_from].present? || conditions[:area_to].present?
						# Format price
						conditions[:area_from] = ApplicationHelper.format_f(conditions[:area_from]).to_f if conditions[:area_from].present?
						conditions[:area_to] = ApplicationHelper.format_f(conditions[:area_to]).to_f if conditions[:area_to].present?

						if conditions[:area_from].present? && conditions[:area_to].present?
							range = conditions[:area_from]..conditions[:area_to]
						elsif conditions[:area_from].present?
							range = conditions[:area_from]..(conditions[:area_from] * 2)
						else
							range = (conditions[:area_to] * 0.5)..conditions[:area_to]
						end
						results = results.where.any_of(
							{
								campus_area: range
							},
							{
								constructional_area: range
							},
							{
								using_area: range
							}
						)
					end

				# / Fields

				# Keyword
				
					if conditions[:keyword].present?
						keyword = ApplicationHelper.deunicode conditions[:keyword]
							.downcase
							.gsub('hooc mon', 'hoc mon')
						keyword_arr = keyword.split ' '

						# Address
						# index = keyword_arr.index{ |v| ['quan', 'huyen'].include? v }
						index = keyword_arr.index{ |v| ['quan', 'huyen', 'duong'].include? v }
						# If exists && not last
						if index.present? && index != keyword_arr.count - 1
							# # If next key is integer => get 'quan' + 1 word
							# # Else => 2 words
							# if keyword_arr[index + 1] =~ /\A\d+\Z/
							# 	address_keyword = "quan #{keyword_arr[index + 1]}cxcx1`"
							# else
							# 	address_keyword = "#{keyword_arr[index + 1]} #{keyword_arr[index + 2]}"
							# end
							results = results.pg_search keyword, {
								:real_estate_id			=>	'A',
								:real_estate_display_id	=>	'A',
								:real_estate_type		=>	'B',
								:address				=>	'A',
								:title 					=>	'D',
								:description 			=>	'D'
							}
						else
							# Normal
							results = results.pg_search keyword
						end

					end
				
				# / Keyword

				results
			end

			# args:
			# 	params:
			# 		value: string
			def self.order_with_params params
				# Return self.order(nil) instead of self
				# because return self will stop chain
				return self.order(nil) if params.blank?

				return case params
				when 'newest'
					self.order(created_at: :desc)
				else
					self.order(nil)
				end
			end

			# params: 
			#   keyword, price(x;y), real_estate_type, is_full, district, price_from, price_to, currency_unit, unit, area, constructional_level
			#   is_favorite
			#   newest, cheapest
			# 	bounds
			def self.search_with_params params = {}
				where = 'is_pending = false AND is_show = true AND is_force_hide = false AND block_real_estate_group_id IS NULL'
				joins = []
				order = {}

				# Purpose
				if params[:purpose].present?
					where += " AND purposes.code = '#{params[:purpose]}'"
					joins << :purpose
				end

				# Price
				if params[:price].present?
					price_range = params[:price].split(';')

					if User.options[:current_purpose] == 'r'
						where += " AND rent_price IS NOT NULL AND rent_price BETWEEN #{price_range[0]} AND #{price_range[1]}"
					else
						where += " AND sell_price IS NOT NULL AND sell_price BETWEEN #{price_range[0]} AND #{price_range[1]}"
					end
				end

				# Price range
				if params[:price_from].present? || params[:price_to].present?
					# Format number
					params[:price_from] = ApplicationHelper.format_f(params[:price_from]).to_f * 1000000 if params[:price_from].present?
					params[:price_to] = ApplicationHelper.format_f(params[:price_to]).to_f * 1000000 if params[:price_to].present?

					if params[:price_from].present? && params[:price_to].present? && params[:price_from] > params[:price_to]
						temp = params[:price_from]
						params[:price_from] = params[:price_to]
						params[:price_to] = temp
					end

					if params[:purpose] == '' || params[:purpose] == 'rent'
						where += " AND rent_price >= #{params[:price_from]}" if params[:price_from].present?
						where += " AND rent_price <= #{params[:price_to]}" if params[:price_to].present?
					end

					if params[:purpose] == '' || params[:purpose] == 'sell'
						where += " AND sell_price >= #{params[:price_from]}" if params[:price_from].present?
						where += " AND sell_price <= #{params[:price_to]}" if params[:price_to].present?
					end
				end

				# Area range
				if params[:area_from].present? || params[:area_to].present?
					# Format number
					params[:area_from] = ApplicationHelper.format_f(params[:area_from]).to_f if params[:area_from].present?
					params[:area_to] = ApplicationHelper.format_f(params[:area_to]).to_f if params[:area_to].present?

					if params[:area_from].present? && params[:area_to].present? && params[:area_from] > params[:area_to]
						temp = params[:area_from]
						params[:area_from] = params[:area_to]
						params[:area_to] = temp
					end

					where += " AND (campus_area >= #{params[:area_from]} OR using_area >= #{params[:area_from]} OR constructional_area >= #{params[:area_from]})" if params[:area_from].present?
					where += " AND (campus_area <= #{params[:area_to]} OR using_area <= #{params[:area_to]} OR constructional_area <= #{params[:area_to]})" if params[:area_to].present?
				end

				# Real estate type
				if params[:real_estate_type].present?
					if ApplicationHelper.numeric? params[:real_estate_type]
						where += " AND real_estate_type_id = #{params[:real_estate_type]}"
					else
						joins << :real_estate_type
						where += " AND real_estate_types.code LIKE '%|#{params[:real_estate_type]}|%'"
					end
				end

				if params[:utilities].present?
					# Pool
					if params[:utilities].has_key? :pool
						joins << :property_utilities
						where += " AND property_utilities.code LIKE '%|pool|%'"
					end
				end

				# Contructional level
				if params[:constructional_level].present?
					joins << :constructional_level
					where += " AND constructional_levels.code LIKE '%|#{params[:constructional_level]}|%'"
				end

				# District
				if params[:district].present?
					joins << :district
					where += " AND districts.id = #{params[:district]}"
				end

				# Area
				if params[:area].present?
					params[:area] = params[:area].split('-')
					params[:area][1] = '1000000' if params[:area][1] == '0'
					where += " AND ((#{params[:area][0]} <= constructional_area AND constructional_area <= #{params[:area][1]}) OR (#{params[:area][0]} <= using_area AND using_area <= #{params[:area][1]}) OR (#{params[:area][0]} <= campus_area AND campus_area <= #{params[:area][1]}))"
				end

				# Favorite
				if params.has_key? :is_favorite
					where += " AND is_favorite = #{params[:is_favorite]}"
				end

				# Time order
				if params.has_key? :newest
					order[:created_at] = 'desc'
				end

				# Price order
				if params.has_key?(:cheapest) || params.has_key?(:price)
					if User.options[:current_purpose] == 'r'
						order[:rent_price] = 'asc'
					else
						order[:sell_price] = 'asc'
					end
				end

				# Bounds
				if params.has_key?(:bounds)
					if params[:bounds][:from][:lat] > params[:bounds][:to][:lat]
						temp = params[:bounds][:from][:lat]
						params[:bounds][:from][:lat] = params[:bounds][:to][:lat]
						params[:bounds][:to][:lat] = temp
					end
					if params[:bounds][:from][:lng] > params[:bounds][:to][:lng]
						temp = params[:bounds][:from][:lng]
						params[:bounds][:from][:lng] = params[:bounds][:to][:lng]
						params[:bounds][:to][:lng] = temp
					end

					where += " AND lat BETWEEN #{params[:bounds][:from][:lat]} AND #{params[:bounds][:to][:lat]}"
					where += " AND lng BETWEEN #{params[:bounds][:from][:lng]} AND #{params[:bounds][:to][:lng]}"
				end

				# where += " AND is_full = #{params[:is_full] || 'true'}"

				joins = joins.uniq

				joins(joins).where(where).order(order)
			end

			def self.user_search_with_params user_type, user_id, params = {}
				where = "user_id = #{user_id} AND user_type = '#{user_type}' AND is_show = true AND is_draft = false AND block_real_estate_group_id IS NULL"
				joins = []
				order = {}

				if User.current.cannot? :manage, RealEstate
					where += ' AND is_force_hide = false'
				end

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
					pg_search(params[:keyword]).joins(joins).where(where).order(order)
				else
					joins(joins).where(where).order(order)
				end
			end

			# params: 
			#   keyword,
			#   newest, cheapest, interact, view, id
			def self.user_favorite_search_with_params user_id, params = {}
				where = "users_favorite_real_estates.user_id = #{User.current.id} AND is_show = true AND is_draft = false AND block_real_estate_group_id IS NULL"
				joins = [:users_favorite_real_estates]
				order = {}

				if User.current.cannot? :manage, RealEstate
					where += ' AND is_force_hide = false'
				end

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
					pg_search(params[:keyword]).joins(joins).where(where).order(order)
				else
					joins(joins).where(where).order(order)
				end
			end

			def self.my_search_with_params conditions = {}, orders = {}
				where = "user_id = #{User.current.id} AND user_type = 'user' AND block_real_estate_group_id IS NULL"
				joins = []
				order = {}

				# Order

					# Id
					if orders.has_key? :id
						order[:id] = orders[:id]
					end
					
					# View count
					if orders.has_key? :view
						order[:view_count] = orders[:view]
					end
					
					# Updated at
					if orders.has_key? :interact
						order[:updated_at] = orders[:interact]
					end

				# / Order

				if conditions[:keyword].present?
					pg_search(conditions[:keyword]).joins(joins).where(where).reorder(order)
				else
					joins(joins).where(where).order(order)
				end
			end

			def self.my_favorite_search_with_params conditions = {}, orders = {}
				where = "users_favorite_real_estates.user_id = #{User.current.id}"
				joins = [:users_favorite_real_estates]
				order = {}

				# Order

					# Id
					if orders.has_key? :id
						order[:id] = orders[:id]
					end
					
					# View count
					if orders.has_key? :view
						order[:view_count] = orders[:view]
					end
					
					# Updated at
					if orders.has_key? :interact
						order[:updated_at] = orders[:interact]
					end

				# / Order

				if conditions[:keyword].present?
					pg_search(conditions[:keyword]).joins(joins).where(where).reorder(order)
				else
					joins(joins).where(where).order(order)
				end
			end

			def self.pending_search_with_params conditions = {}, orders = {}
				where = 'is_pending = true AND is_draft = false AND is_active = true AND block_real_estate_group_id IS NULL'
				joins = []
				order = {}

				# Order

					# Id
					if orders.has_key? :id
						order[:id] = orders[:id]
					end
					
					# View count
					if orders.has_key? :view
						order[:view_count] = orders[:view]
					end
					
					# Updated at
					if orders.has_key? :interact
						order[:updated_at] = orders[:interact]
					end

				# / Order

				if conditions[:keyword].present?
					pg_search(conditions[:keyword]).joins(joins).where(where).reorder(order)
				else
					joins(joins).where(where).order(order)
				end
			end

			# params: 
			#   keyword,
			#   newest, cheapest, interact, view, id, favorite
			def self.manage_search_with_params conditions = {}, orders = {}
				where = 'is_pending = false AND block_real_estate_group_id IS NULL'
				joins = []
				order = {}

				# Order

					# Id
					if orders.has_key? :id
						order[:id] = orders[:id]
					end
					
					# View count
					if orders.has_key? :view
						order[:view_count] = orders[:view]
					end
					
					# Updated at
					if orders.has_key? :interact
						order[:updated_at] = orders[:interact]
					end
					
					# Updated at
					if orders.has_key? :favorite
						order[:is_favorite] = orders[:favorite]
					end

				# / Order

				if conditions[:keyword].present?
					pg_search(conditions[:keyword]).joins(joins).where(where).reorder(order)
				else
					joins(joins).where(where).order(order)
				end
			end

		# / Search with params

		# Get need notify users
		
			def self.need_notify_users notification
				case notification.action
				when 'create', 'edit'
					User.joins(system_groups: :permissions).where(permissions: { id: 2 }).all.map{ |user| [user.id, 'user'] }
				when 'approve'
					if notification.real_estate.user_type == 'user'
						[[notification.real_estate.user_id, 'user']]
					else
						[]
					end
				else
					[]
				end
			end
		
		# / Get need notify users

	# / Get

	# Updates

		# Update onwer info
		
			def self.set_owner_info _params
				_re = find _params[:id]

				if _params[:type] == 'agency' || _params[:type] == 'other'

					_re.owner_type = 'agency'
					_re.owner_info ||= RealEstateOwner.new

					_re.owner_info.name = _params[:name]
					_re.owner_info.phone = _params[:phone]
					_re.owner_info.email = _params[:email]
					_re.owner_info.address = _params[:address]

				elsif _params[:type] == 'owner'

					_re.owner_type = 'owner'

				else

					_re.owner_type = nil

				end

				_re.save

				{ status: 0 }
			end
		
		# / Update onwer info

		# Update show status

			def self.update_show_status id, is_show
				real_estate = find id

				# Author
				return { status: 6 } if User.current.cannot? :change_show_status, real_estate

				real_estate.is_show = is_show

				if real_estate.save validate: false
					{ status: 0 }
				else
					{ status: 2 }
				end
			end

		# / Update show status

		# Update force hide status

			def self.update_force_hide_status id, is_force_hide
				real_estate = find id

				# Author
				return { status: 6 } if User.current.cannot? :manage, real_estate

				real_estate.is_force_hide = is_force_hide

				if real_estate.save validate: false
					{ status: 0 }
				else
					{ status: 2 }
				end
			end

		# / Update force hide status

		# Update favorite status

			def self.update_favorite_status id, is_favorite
				real_estate = find id

				# Author
				return { status: 6 } if User.current.cannot? :manage, real_estate

				real_estate.is_favorite = is_favorite

				if real_estate.save validate: false
					{ status: 0 }
				else
					{ status: 2 }
				end
			end

		# / Update favorite status

		# Update pending status

			def self.update_pending_status id, is_pending
				# Author
				return { status: 6 } if User.current.cannot? :manage, RealEstate

				real_estate = find id

				real_estate.is_pending = is_pending

				if real_estate.save validate: false
					{ status: 0 }
				else
					{ status: 2 }
				end
			end

		# / Update pending status

		# Active

			def self.active id, secure_code
				re = find id

				return { status: 1 } if re.is_active

				return { status: 0, result: 1 } if re.params['secure_code'] != secure_code

				re.is_active = true
				re.save
				{ status: 0, result: 0 }
			end

		# / Active

	# / Update

	# Helper

		# Get fields

		def self.get_fields re
			fields = [
				:purpose, :currency, :is_negotiable,
				:address_number, :province, :district, :ward, :street, :lat, :lng,
				:title, :description]

			if re.purpose.present?
				fields << :sell_price if re.purpose.code == 'transfer'
				fields << :sell_price << :sell_unit if re.purpose.code == 'sell' || re.purpose.code == 'sell_rent'
				fields << :rent_price << :rent_unit if re.purpose.code == 'rent' || re.purpose.code == 'sell_rent'
			end

			if re.is_full
				fields << :street_type << :is_alley
				fields << :alley_width if re.is_alley
				fields << :real_estate_type << :region_utility << :advantage << :disadvantage

				if re.purpose.present? && (re.purpose.code == 'sell' || re.purpose.code == 'sell_rent')
					fields << :legal_record_type << :planning_status_type
					fields << :custom_legal_record_type if re.legal_record_type_id == 0
					fields << :custom_planning_status_type if re.planning_status_type_id == 0
				end

				if re.real_estate_type.present?
					case re.real_estate_type.options['group']
						when 'land'
							fields << :campus_area << :shape << :width_x << :width_y
						when 'space', 'house'
							fields << :campus_area << :using_area << :constructional_area << :restroom_number << :bedroom_number << :build_year <<
								:constructional_quality << :direction << :shape << :width_x << :width_y << :property_utility
							if re.real_estate_type.options['group'] == 'house'
								fields << :floor_number
								if re.real_estate_type.name == 'town_house'
									fields << :constructional_level
								end
							end
							if re.real_estate_type.name == 'office'
								fields << :building_name
							end
						when 'apartment'
							fields << :building_name << :using_area << :floor_number << :bedroom_number << :restroom_number <<
								:build_year << :constructional_quality << :direction << :property_utility
					end
				end
			else
				fields << :real_estate_type << :campus_area
			end

			fields
		end

		# / Get fields

		# Get meta search

		def assign_meta_search
			assign_attributes meta_search_1: "#{display_id} #{title} #{description}"
			
			# tempLocale = I18n.locale
			# I18n.locale = 'vi'

			# assign_attributes meta_search_1: "#{display_id} #{id} #{street.name if street.present?} #{district.name.gsub('Quận', '') if district.present?} #{I18n.t('real_estate_type.name.' + real_estate_type.name) if real_estate_type.present?}", meta_search_2: "#{I18n.t('real_estate.attribute.' + (is_alley ? 'alley' : 'facade'))} #{province.name if province.present?}", meta_search_3: "#{user_type == 'user' ? "#{user.full_name} #{user.email} #{user.phone_number}" : "#{contact_user.name} #{contact_user.email} #{contact_user.phone_number}"} #{title.gsub('Quận', '').gsub('quận', '')}"

			# I18n.locale = tempLocale
		end

		# / Get meta search

	# / Helper

	# Delete
		
		def self.delete_by_id id
			real_estate = find id

			return { status: 1 } if real_estate.nil?

			# Author
			return { status: 6 } if User.current.cannot? :delete, real_estate

			_user_id = real_estate.user_id

			if delete id
				{ status: 0 }
			else
				{ status: 2 }
			end
		end

	# / Delete

	# Class attributes

		def self.i18n_attribute key
			I18n.t 'real_estate.attributes.' + key
		end

		def self.i18n_value key, value, type = 'text'
			case type
			when 'text'
				I18n.t "real_estate.values.#{key}.#{value}"
			when 'count'
				I18n.t "real_estate.values.#{key}", count: value
			end
		end
	
	# / Class attributes

	# Attributes

		serialize :params, JSON
		serialize :floor_infos_text, JSON
		attr_accessor :location

		# reverse_geocoded_by :lat, :lng

		# Fields
		def fields reload = false
			@fields = false if reload
			@fields ||= RealEstate.get_fields self
		end

		# Name
		def name
			@name ||= "#{I18n.t('purpose.name.' + purpose.name) unless purpose.nil?} #{I18n.t('real_estate_type.name.' + real_estate_type.name) unless real_estate_type.nil?} - #{I18n.t('real_estate.attribute.' + (is_alley ? 'alley' : 'facade'))} #{street.name unless street.nil?} #{district.name unless district.nil?} #{province.name unless province.nil?}"
		end

		# Slug
		def full_slug
			@full_slug ||= "#{slug}-#{id}"
		end

		# ID
		def display_id just_id = false
			if just_id
				id.to_s
			else
				ApplicationHelper.id_format id, 'RE'
			end
		end

		# Description
		def display_description
			description.present? ? description.html_safe : ''
		end

		# User name
		def display_user_name
			@display_user_name ||= user_type == 'user' ? user.full_name : contact_user.name
		end

		# User email
		def display_user_email
			@display_user_email ||= user_type == 'user' ? user.email : contact_user.email
		end

		# User phone number
		def display_user_phone_number
			@display_user_phone_number ||= user_type == 'user' ? user.phone_number : contact_user.phone_number
		end

		# Address
		def display_short_address
			@display_address ||= "#{street.name unless street.nil?}#{', ' + district.name unless district.nil?}#{', ' + province.name unless province.nil?}".gsub(/\b\w/) { $&.capitalize }
		end
		def display_address
			@display_address ||= "#{address_number} #{street.name unless street.nil?}#{', ' + ward.name unless ward.nil?}#{', ' + district.name unless district.nil?}#{', ' + province.name unless province.nil?}".gsub(/\b\w/) { $&.capitalize }
		end

		# Street
		def display_street
			@display_street ||= street.present? ? street.name : ''
		end

		# Ward
		def display_ward
			@display_ward ||= ward.present? ? ward.name : ''
		end

		# District
		def display_district
			@display_district ||= district.present? ? district.name : ''
		end

		# Province
		def display_province
			@display_province ||= province.present? ? province.name : ''
		end

		# Street type
		def display_street_type
			@display_street_type ||= 
			 	fields.include?(:street_type) ? 
				 	case street_type
					when 1
						'Đường nội bộ'
					else
						'Đường chính'
					end
				:
					''
		end

		# Area
		def display_area
			@display_area ||= fields.include?(:campus_area) && campus_area.present? ? ApplicationHelper.display_decimal(campus_area) : (fields.include?(:constructional_area) ? ApplicationHelper.display_decimal(constructional_area) : ApplicationHelper.display_decimal(using_area)) 
		end
		def display_campus_area
			@display_campus_area ||= fields.include?(:campus_area) && campus_area.present? ? ApplicationHelper.display_decimal(campus_area) : ''
		end
		def display_constructional_area
			@display_constructional_area ||= fields.include?(:constructional_area) && constructional_area.present? ? ApplicationHelper.display_decimal(constructional_area) : ''
		end
		def display_using_area
			@display_using_area ||= fields.include?(:using_area) && using_area.present? ? ApplicationHelper.display_decimal(using_area) : ''
		end

		# Width
		def display_width_x
			@display_width_x ||= fields.include?(:width_x) && width_x.present? ? ApplicationHelper.display_decimal(width_x) : ''
		end
		def display_width_y
			@display_width_y ||= fields.include?(:width_y) && width_y.present? ? ApplicationHelper.display_decimal(width_y) : ''
		end

		# Shape
		def display_shape display_normal = true
			if display_normal
				@display_shape_display_normal ||= 
					fields.include?(:shape) ?
						case shape
						when 0
							'Bình thường'
						when 1
							'Nở hậu'
						when 2
							'Tóp hậu'
						else
							''
						end
					:
						''
			else
				@display_shape_no_display_normal ||= 
					fields.include?(:shape) ?
						case shape
						when 1
							'Nở hậu'
						when 2
							'Tóp hậu'
						else
							''
						end
					:
						''
			end
		end

		# Shape width
		def display_shape_width
			@display_shape_width ||= fields.include?(:shape) && (shape == 1 || shape == 2) && shape_width.present? ? ApplicationHelper.display_decimal(shape_width) : ''
		end

		# Is alley
		def display_is_alley
			@display_is_alley ||= 
				fields.include?(:is_alley) ? 
					(is_alley ? 'Hẻm' : 'Mặt tiền')
				:
					''
		end

		# Alley width
		def display_alley_width
			@display_alley_width ||= fields.include?(:is_alley) && is_alley && alley_width.present? ? ApplicationHelper.display_decimal(alley_width) : ''
		end

		# Direction
		def display_direction
			@display_direction ||= fields.include?(:direction) && direction.present? ? I18n.t("direction.text.#{direction.name}") : ''
		end

		# Contructional level
		def display_constructional_level
			@display_constructional_level ||= fields.include?(:constructional_level) && constructional_level.present? ? I18n.t("constructional_level.name.#{constructional_level.name}") : ''
		end

		# Real estate type
		def display_real_estate_type
			@display_real_estate_type ||= real_estate_type.present? ? I18n.t("real_estate_type.name.#{real_estate_type.name}") : ''
		end

		# Restroom
		def display_restroom
			@display_restroom ||= 
				fields.include?(:restroom_number) ?
					(restroom_number == 4 ? '>4' : restroom_number)
				:
					''
		end

		# Bedroom
		def display_bedroom
			@display_bedroom ||= 
				fields.include?(:bedroom_number) ?
					(bedroom_number == 4 ? '>4' : bedroom_number)
				:
					''
		end

		# Purpose
		def display_purpose
			@display_purpose ||= purpose.present? ? I18n.t("purpose.name.#{purpose.name}") : ''
		end

		# Currency
		def display_currency
			@display_currency ||= currency.present? ? currency.name : ''
		end

		# Sell price
		def display_sell_price
			@display_sell_price_text ||=
				fields.include?(:sell_price) ?
					(sell_price_text.blank? ? 'Giá thỏa thuận' : sell_price_text + (currency.code != 'VND' ? ' ' + currency.name : '') + I18n.t('unit.text.display_' + sell_unit.name)).html_safe
				:
					''
		end

		# Sell unit
		def display_sell_unit
			@display_sell_unit ||= fields.include?(:sell_unit) && sell_unit.present? ? I18n.t("unit.text.#{sell_unit.name}") : ''
		end

		# Rent price
		def display_rent_price
			@display_rent_price_text ||=
				fields.include?(:rent_price) ?
					(rent_price_text.blank? ? 'Giá thỏa thuận' : rent_price_text + (currency.code != 'VND' ? ' ' + currency.name : '') + I18n.t('unit.text.display_' + rent_unit.name)).html_safe
				:
					''
		end

		# Rent unit
		def display_rent_unit
			@display_rent_unit ||= fields.include?(:rent_unit) && rent_unit.present? ? I18n.t("unit.text.#{rent_unit.name}") : ''
		end

		# Price
		def display_price
			if User.options[:current_purpose] == 'r'
				display_rent_price
			else
				display_sell_price
			end
		end

		# Legal record type
		def display_legal_record_type _allow_from_custom = true
			if _allow_from_custom
				@display_legal_record_type_afc ||= 
					fields.include?(:legal_record_type) ?
						(
							legal_record_type_id != 0 ? 
								(
									legal_record_type.present? ?
										I18n.t("legal_record_type.text.#{legal_record_type.name}")
									:
										''
								) 
							:
								custom_legal_record_type
						)
					:
						''
			else
				@display_legal_record_type ||= 
					fields.include?(:legal_record_type) && legal_record_type.present? ? 
						I18n.t("legal_record_type.text.#{legal_record_type.name}")
					: 
						''
			end
		end

		# Planning status type
		def display_planning_status_type _allow_from_custom = true
			if _allow_from_custom
				@display_planning_status_type_afc ||= 
					fields.include?(:planning_status_type) ?
						(
							planning_status_type_id != 0 ? 
								(
									planning_status_type.present? ?
										I18n.t("planning_status_type.text.#{planning_status_type.name}")
									:
										''
								) 
							:
								custom_planning_status_type
						) 
					:
						''
			else
				@display_planning_status_type ||= 
					fields.include?(:planning_status_type) && planning_status_type.present? ? 
						I18n.t("planning_status_type.text.#{planning_status_type.name}") 
					: 
						''
			end
		end

		# Constructional quality
		def display_constructional_quality
			@display_constructional_quality ||=
				fields.include?(:constructional_quality) ? 
					case constructional_quality
					when 1
						'Đang xuống cấp'
					when 2
						'Còn tốt'
					when 3
						'Mới'
					else
						'Rất mới'
					end
			:
				''
		end

		# Owner type
		def display_owner_type
			@display_owner_type ||= case owner_type
			when 'owner'
				'Chủ sở hữu'
			when 'agency'
				'Được ký gửi'
			when 'other'
				'Khác'
			end
		end

		# Appraisal purpose
		def display_appraisal_purpose
			@display_appraisal_purpose ||= case appraisal_purpose
			when 1
				'Mua bán'
			when 2
				'Vay vốn ngân hàng'
			when 3
				'Xác định giá trị'
			end				
		end

		# Appraisal type
		def display_appraisal_type
			@display_appraisal_type ||= case appraisal_type
			when 1
				'Tư vấn miễn phí'
			when 2
				'Thẩm định'
			end				
		end

		# Status
		def display_status
			@display_status ||= case self.status
			when 'available'
				'Đang cung cấp'
			when 'unavailable'
				'Không cung cấp'
			when 'sold'
				'Đã bán'
			else
				''
			end				
		end

		# Current user favorite
		def get_is_current_user_favorite
			return false unless User.signed?

			return UsersFavoriteRealEstate.exists? real_estate_id: id, user_id: User.current.id
		end
		def is_current_user_favorite
			@is_current_user_favorite ||= get_is_current_user_favorite
		end

	# / Attributes

	# Get keyword

		def keyword
			legal = legal_record_type_id == 0 ? legal_record_type.name : custom_legal_record_type
			alley = is_alley == 1 ? 'Hẻm' : 'Mặt tiền'

			keyword =  
				"#{name}, #{purpose.name} #{real_estate_type.name} quận #{district.name}, #{real_estate_type.name} #{legal}, #{real_estate_type.name} #{alley}, #{alley} quận #{district.name}, #{street.name} quận #{district.name}, #{purpose.name}, #{province.name}, #{real_estate_type.name}, #{legal}"
		end

	# / Get keyword

	# Zoho

		def self.zoho_fields
			@zoho_fields ||= ['display_id', 'id', 'title', 'real_estate_type', 'address_number', 'street', 'ward', 'district', 'province', 'street_type', 'is_alley', 'alley_width', 'direction', 'constructional_level', 'legal_record_type', 'campus_area', 'constructional_area', 'using_area', 'width_x', 'width_y', 'shape', 'bedroom_number', 'restroom_number', 'build_year', 'constructional_quality', 'planning_status_type', 'property_utilities', 'region_utilities', 'advantages', 'custom_advantages', 'disadvantage', 'custom_disadvantages', 'user', 'owner_type', 'owner_info_name', 'owner_info_email', 'owner_info_phone', 'owner_info_address', 'purpose', 'currency', 'sell_price', 'sell_unit', 'rent_price', 'rent_unit', 'is_negotiable', 'appraisal_purpose', 'appraisal_type']
		end
	
		def zoho_get_attribute _attribute
			case _attribute
			when 'zoho_id'
				{
					val: 'Id',
					text: zoho_id
				}
			when 'display_id'
				{
					val: 'Product Code',
					text: display_id
				}
			when 'id'
				{
					val: 'MNO Id',
					text: id
				}
			when 'title'
				{
					val: 'Product Name',
					text: title
				}
			when 'real_estate_type'
				{
					val: 'Product Category',
					text: display_real_estate_type
				}
			when 'address_number'
				{
					val: 'Số nhà',
					text: address_number
				}
			when 'street'
				{
					val: 'Đường',
					text: display_street
				}
			when 'ward'
				{
					val: 'Phường',
					text: display_ward
				}
			when 'district'
				{
					val: 'Quận/Huyện',
					text: display_district
				}
			when 'province'
				{
					val: 'Tỉnh/TP',
					text: display_province
				}
			when 'street_type'
				{
					val: 'Loại đường',
					text: display_street_type
				}
			when 'is_alley'
				{
					val: 'Vị trí',
					text: display_is_alley
				}
			when 'alley_width'
				{
					val: 'Độ rộng của hẻm',
					text: display_alley_width
				}
			when 'direction'
				{
					val: 'Hướng',
					text: display_direction
				}
			when 'constructional_level'
				{
					val: 'Loại nhà',
					text: display_constructional_level
				}
			when 'legal_record_type'
				{
					val: 'Hồ sơ pháp lý',
					text: display_legal_record_type(false).present? ? display_legal_record_type(false) : 'Khác'
				}
			when 'campus_area'
				{
					val: 'DT khuôn viên',
					text: display_campus_area
				}
			when 'constructional_area'
				{
					val: 'DT xây dựng',
					text: display_constructional_area
				}
			when 'using_area'
				{
					val: 'DT sàn',
					text: display_using_area
				}
			when 'width_x'
				{
					val: 'Rộng',
					text: display_width_x
				}
			when 'width_y'
				{
					val: 'Dài',
					text: display_width_y
				}
			when 'shape'
				{
					val: 'Hình dáng',
					text: display_shape
				}
			when 'bedroom_number'
				{
					val: 'Phòng ngủ',
					text: bedroom_number
				}
			when 'restroom_number'
				{
					val: 'Phòng tắm',
					text: restroom_number
				}
			when 'build_year'
				{
					val: 'Năm xây dựng',
					text: build_year
				}
			when 'constructional_quality'
				{
					val: 'Chất lượng xây dựng',
					text: display_constructional_quality
				}
			when 'planning_status_type'
				{
					val: 'Tình trạng quy hoạch',
					text: display_planning_status_type(false).present? ? display_planning_status_type(false) : 'Khác'
				}
			when 'property_utilities'
				{
					val: 'Tiện ích BĐS',
					text: property_utilities.present? ? property_utilities.map{ |utility| utility.display_name }.join(';') : ''
				}
			when 'region_utilities'
				{
					val: 'Tiện ích khu vực',
					text: region_utilities.present? ? region_utilities.map{ |utility| utility.display_name }.join(';') : ''
				}
			when 'advantages'
				{
					val: 'Ưu điểm',
					text: advantages.present? ? advantages.map{ |advantage| advantage.display_name }.join(';') : ''
				}
			when 'custom_advantages'
				{
					val: 'Ưu điểm khác',
					text: custom_advantages
				}
			when 'disadvantage'
				{
					val: 'Khuyết điểm',
					text: disadvantages.present? ? disadvantages.map{ |disadvantage| disadvantage.display_name }.join(';') : ''
				}
			when 'custom_disadvantages'
				{
					val: 'Khuyết điểm khác',
					text: custom_disadvantages
				}
			when 'user'
				{
					val: 'Người đăng tin_ID',
					text: user.present? ? user.zoho_id : ''
				}
			when 'owner_type'
				{
					val: 'Mối quan hệ với BĐS',
					text: display_owner_type
				}
			when 'owner_info_name'
				{
					val: 'Chủ sở hữu',
					text: owner_type == 'owner' && owner_info.present? ? owner_info.name : ''
				}
			when 'owner_info_email'
				{
					val: 'Email CSH',
					text: owner_type == 'owner' && owner_info.present? ? owner_info.email : ''
				}
			when 'owner_info_phone'
				{
					val: 'Phone',
					text: owner_type == 'owner' && owner_info.present? ? owner_info.phone : ''
				}
			when 'owner_info_address'
				{
					val: 'Địa chỉ',
					text: owner_type == 'owner' && owner_info.present? ? owner_info.address : ''
				}
			when 'purpose'
				{
					val: 'Loại giao dịch',
					text: display_purpose
				}
			when 'currency'
				{
					val: 'Loại tiền tệ',
					text: display_currency
				}
			when 'sell_price'
				{
					val: 'Giá bán',
					text: sell_price
				}
			when 'sell_unit'
				{
					val: 'Đơn vị bán',
					text: display_sell_unit
				}
			when 'rent_price'
				{
					val: 'Giá cho thuê',
					text: rent_price
				}
			when 'rent_unit'
				{
					val: 'Đơn vị cho thuê',
					text: display_rent_unit
				}
			when 'is_negotiable'
				{
					val: 'Có thể thương lượng',
					text: is_negotiable
				}
			when 'appraisal_purpose'
				{
					val: 'Mục đích thẩm định',
					text: display_appraisal_purpose
				}
			when 'appraisal_type'
				{
					val: 'Loại thẩm định',
					text: display_appraisal_type
				}
			else
				nil
			end						
		end

		def self.zoho_create_xml_nodes xml, re, attributes
			attributes.each do |attribute|

				# Get data from attribute (mno)
				data = re.zoho_get_attribute attribute

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
			User.zoho_sync

			# Update real-estate
			
				# Get all real-estates has zoho changed
				total_res = where zoho_is_changed: true

				# If exist
				if total_res.count > 0

					total_res.each_slice(100).to_a.each do |res|

						# Create xml records
						res_records = Nokogiri::XML::Builder.new do |xml|
							xml.Products {
								res.each_with_index do |re, index|

									xml.row(no: index + 1) {
										zoho_create_xml_nodes xml, re, zoho_fields + ['zoho_id']
									}

								end
							}
						end

						result = HTTParty.post(
							'https://crm.zoho.com/crm/private/xml/Products/updateRecords', 
							body: {
								authtoken: '427ecfa73f98d6aa29f7e932d3c2913f',
								scope: 'crmapi',
								xmlData: res_records.to_xml,
								version: 4
							}
						)

						if result['response']['result'].present?
							if result['response']['result']['row'].class == Array
								result['response']['result']['row'].each_with_index do |record, index|
									if record.has_key? 'success'
										res[index].zoho_is_changed = false
										res[index].save
									end
								end
							else
								record = result['response']['result']['row'].first
								if record[0] == 'success'
									res[0].zoho_is_changed = false
									res[0].save
								end
							end
						end

					end

				end
				
			# / Update real-estate

			# Create new real-estate
				
				# Get all real estate without zoho id
				total_res = where zoho_id: nil

				# If exist
				if total_res.count > 0

					total_res.each_slice(100).to_a.each do |res|

						# Create xml records
						res_records = Nokogiri::XML::Builder.new do |xml|
							xml.Products {
								res.each_with_index do |re, index|

									xml.row(no: index + 1) {
										zoho_create_xml_nodes xml, re, zoho_fields
									}

								end
							}
						end

						result = HTTParty.post(
							'https://crm.zoho.com/crm/private/xml/Products/insertRecords', 
							body: {
								authtoken: '427ecfa73f98d6aa29f7e932d3c2913f',
								scope: 'crmapi',
								xmlData: res_records.to_xml,
								version: 4
							}
						)

						if result['response']['result'].present?
							if result['response']['result']['row'].class == Array
								result['response']['result']['row'].each_with_index do |record, index|
									if record.has_key? 'success'
										res[index].zoho_id = ApplicationHelper.zoho_get_content_by_val record['success']['details']['FL'], 'Id'
										res[index].zoho_is_changed = false
										res[index].save
									end
								end
							else
								record = result['response']['result']['row'].first
								if record[0] == 'success'
									res[0].zoho_id = ApplicationHelper.zoho_get_content_by_val record[1]['details']['FL'], 'Id'
									res[0].zoho_is_changed = false
									res[0].save
								end
							end
						end

					end

				end
			
			# / Create new real-estate
		end

	# / Zoho

end