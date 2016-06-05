class ReRegistration < ActiveRecord::Base

	# Associations

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

			self.locations = []
			if params[:locations].present?
				params[:locations].each_with_index do |location, index|
					if location[:province].present?
						if location[:province] == 'Hồ Chí Minh'
							location[:province] = 'Tp. Hồ Chí Minh'
						end
						province = Province.find_or_create_by name: location[:province]
						location[:province_id] = province.id
					end
					if location[:district].present?
						district = District.find_or_create_by name: location[:district], province_id: location[:province_id]
						location[:district_id] = district.id
					end
					if location[:street].present?
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

			self.assign_attributes params.permit [
				:purpose_id, :min_price, :max_price, :min_area, :max_area,
				real_estate_type_ids: []
			]
		end
	
		def save_with_params params
			self.assign_attributes_with_params params

			self.save
		end
	
	# / Save

end
