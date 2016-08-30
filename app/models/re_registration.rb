class ReRegistration < ActiveRecord::Base

	# Associations

		belongs_to :purpose

		has_many :locations,
			class_name: 	'ReRegistrationLocation',
			autosave: 		true,
			dependent: 		:delete_all

		has_and_belongs_to_many :real_estate_types,
			join_table: 	're_registrations_re_types',
			autosave: 		true,
			dependent: 		:delete_all

	# / Associations

	# Save

		def assign_attributes_with_params params

			if params[:locations].present?
				self.locations = ReRegistrationLocation.find params[:locations].map { |value| value[:id] }
			else
				self.locations = []
			end
			if params[:new_locations].present?
				params[:new_locations].each do |location|
					if location[:province].present?
						if location[:province] == 'Hồ Chí Minh'
							location[:province] = 'Tp. Hồ Chí Minh'
						end
						province = Province.find_or_create_by name: location[:province]
						location[:province_id] = province.id
					end
					if location[:district].present? && location[:province_id].present?
						district = District.find_or_create_by name: location[:district], province_id: location[:province_id]
						location[:district_id] = district.id
					end
					if location[:street].present? && location[:district_id].present?
						street = Street.find_or_create_by name: location[:street], district_id: location[:district_id]
						location[:street_id] = street.id
					end

					object = ReRegistrationLocation.new
					object.object_type 	=	location[:type]
					object.object_id 	= 	case location[:type]
											when 'province'
												location[:province_id]
											when 'district'
												location[:district_id]
											when 'street'
												location[:street_id]
											else
												next
											end

					self.locations << object
				end
			end

			params[:min_rent_price] = ApplicationHelper.format_i params[:min_rent_price] if params[:min_rent_price].present?
			params[:max_rent_price] = ApplicationHelper.format_i params[:max_rent_price] if params[:max_rent_price].present?
			params[:min_sell_price] = ApplicationHelper.format_i params[:min_sell_price] if params[:min_sell_price].present?
			params[:max_sell_price] = ApplicationHelper.format_i params[:max_sell_price] if params[:max_sell_price].present?

			self.assign_attributes params.permit [
				:purpose_id, :min_sell_price, :max_sell_price, :min_rent_price, :max_rent_price, :min_area, :max_area,
				:user_type, :user_id,
				real_estate_type_ids: []
			]
		end
	
		def save_with_params params
			self.assign_attributes_with_params params

			self.expires_at = 14.days.from_now

			self.save
		end
	
	# / Save

	# Class attributes

		def self.i18n_attribute key
			I18n.t 're_registration.attributes.' + key
		end
	
	# / Class attributes

	# Class get
	
		def self.of_current_user
			if User.current.present?
				self.where(
					user_type:	'user',
					user_id:	User.current.id
				)
			else
				self.none
			end
		end
	
	# / Class get

	# Attributes
	
		def display_purpose
			purpose.display_name(true)
		end
	
		def display_min_sell_price
			ApplicationHelper.read_money self.min_sell_price
		end
	
		def display_max_sell_price
			ApplicationHelper.read_money self.max_sell_price
		end
	
		def display_min_rent_price
			ApplicationHelper.read_money self.min_rent_price
		end
	
		def display_max_rent_price
			ApplicationHelper.read_money self.max_rent_price
		end
	
		def display_min_area
			ApplicationHelper.display_decimal self.min_area
		end
	
		def display_max_area
			ApplicationHelper.display_decimal self.max_area
		end

		def display_expires_at
			ApplicationHelper.display_datetime self.expires_at
		end
	
	# / Attributes

	# Get
	
		def matching_real_estates
			conditions = [RealEstate.can_view_conditions]
			joins = []

			# Locations
			if self.locations.present?
				or_conditions = []

				self.locations.each do |location|
					case location.object_type
					when 'province'
						or_conditions << "real_estates.province_id = #{location.object_id}"
					when 'district'
						or_conditions << "real_estates.district_id = #{location.object_id}"
					when 'street'
						or_conditions << "real_estates.street_id = #{location.object_id}"
					end
				end

				conditions << "(#{or_conditions.join(' OR ')})" if or_conditions.present?
			end

			# Re type
			if self.real_estate_types.present?
				or_conditions = []

				self.real_estate_types.each do |type|
					or_conditions << "real_estates.real_estate_type_id = #{type.id}"
				end

				conditions << "(#{or_conditions.join(' OR ')})" if or_conditions.present?
			end

			# Area
			if self.min_area.present?
				or_conditions	=	[
										"real_estates.campus_area >= #{self.min_area}",
										"real_estates.constructional_area >= #{self.min_area}",
										"real_estates.using_area >= #{self.min_area}"
									]
				conditions << "(#{or_conditions.join(' OR ')})" if or_conditions.present?
			end
			if self.max_area.present?
				or_conditions	=	[
										"real_estates.campus_area <= #{self.max_area}",
										"real_estates.constructional_area <= #{self.max_area}",
										"real_estates.using_area <= #{self.max_area}"
									]
				conditions << "(#{or_conditions.join(' OR ')})" if or_conditions.present?
			end

			# Purpose, price
			if self.purpose_id.present? && self.purpose.present?
				or_conditions = []
				joins << :purpose

				# Purpose
				or_conditions = case self.purpose.code
				when 'sell_rent'
					[
						'purposes.code = \'sell\'',
						'purposes.code = \'rent\''
					]
				when 'sell'
					[
						'purposes.code = \'sell\'',
						'purposes.code = \'sell_rent\''
					]
				when 'rent'
					[
						'purposes.code = \'rent\'',
						'purposes.code = \'sell_rent\''
					]
				when 'transfer'
					[
						'purpose.code = \'transfer\''
					]
				else
					[]
				end
				conditions << "(#{or_conditions.join(' OR ')})" if or_conditions.present?

				# Price
				# Sell price
				or_conditions = []
				if ['sell_rent', 'sell'].include? self.purpose.code
					and_conditions = []
					if self.min_sell_price.present?
						and_conditions << "real_estates.sell_price >= #{self.min_sell_price}"
					end
					if self.max_sell_price.present?
						and_conditions << "real_estates.sell_price <= #{self.max_sell_price}"
					end
					or_conditions << "(#{and_conditions.join(' AND ')})" if and_conditions.present?
				end
				if ['sell_rent', 'rent', 'transfer'].include? self.purpose.code
					and_conditions = []
					if self.min_rent_price.present?
						and_conditions << "real_estates.rent_price >= #{self.min_rent_price}"
					end
					if self.max_rent_price.present?
						and_conditions << "real_estates.rent_price <= #{self.max_rent_price}"
					end
					or_conditions << "(#{and_conditions.join(' AND ')})" if and_conditions.present?
				end
				conditions << "(#{or_conditions.join(' OR ')})" if or_conditions.present?
			else
				or_conditions = []

				# Sell
				and_conditions = []
				if self.min_sell_price.present?
					and_conditions << "real_estates.sell_price >= #{self.min_sell_price}"
				end
				if self.max_sell_price.present?
					and_conditions << "real_estates.sell_price <= #{self.max_sell_price}"
				end
				or_conditions << "(#{and_conditions.join(' AND ')})" if and_conditions.present?

				# Rent
				and_conditions = []
				if self.min_rent_price.present?
					and_conditions << "real_estates.rent_price >= #{self.min_rent_price}"
				end
				if self.max_rent_price.present?
					and_conditions << "real_estates.rent_price <= #{self.max_rent_price}"
				end
				or_conditions << "(#{and_conditions.join(' AND ')})" if and_conditions.present?

				conditions << "(#{or_conditions.join(' OR ')})" if or_conditions.present?
			end

			RealEstate.joins(joins).where(conditions.join(' AND ')).order(updated_at: :desc)
		end
	
	# / Get

end