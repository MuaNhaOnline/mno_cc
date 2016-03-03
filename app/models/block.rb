class Block < ActiveRecord::Base

	# Associations

		belongs_to :project
		belongs_to :block_type

		has_many :images, class_name: 'BlockImage', autosave: true, dependent: :destroy
		has_many :floors, class_name: 'BlockFloor', autosave: true, dependent: :destroy
		has_many :real_estate_groups, class_name: 'BlockRealEstateGroup', autosave: true, dependent: :destroy
		has_many :real_estates, class_name: 'RealEstate', dependent: :destroy

	# / Associations

	# Validations

		validate :custom_validate

		def custom_validate
			# Name
			if name.blank?
				errors.add :name, 'Tên không thể bỏ trống'
				return
			end

			# Description
			# if description.blank?
			# 	errors.add :description, 'Mô tả không thể bỏ trống'
			# 	return
			# end
		end

	# / Validations

	# Insert

		# Assign with params

			def assign_attributes_with_params params

				# Block type
				if new_record?
					params[:block_type_id] = params[:detail_block_type_id].present? ? params[:detail_block_type_id] : params[:block_type_id]
					
					if params[:block_type_id].blank?
						_project = Project.find(params[:project_id])
						params[:block_type_id] = case _project.project_type.name
						when 'low_apartment'
							7
						when 'medium_apartment'
							8
						when 'high_apartment'
							9
						when 'social_home'
							10
						when 'complex_apartment'
							5
						when 'adjacent_town_house'
							3
						when 'adjacent_villa'
							14
						when 'office'
							2
						when 'land'
							4
						end
					end
				else
					params[:block_type_id] = block_type_id
				end

				# Images
				_images = []
				_has_avatar = false
				if params[:images].present?
					params[:images].each do |_v|
						_value = JSON.parse _v
						_value['is_avatar'] ||= false

						if _value['is_new']
							TemporaryFile.get_file(_value['id']) do |_image, _id|
								_images << BlockImage.new(image: _image, is_avatar: _value['is_avatar'], order: _value['order'], description: _value['description'])

								_has_avatar = true if _value['is_avatar']
							end
						else
							_image = BlockImage.find _value['id']
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

				# Floor

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

					_floor_params = params[:floor]
					_floors = []

					_floor_params.each_value do |_value_params|
						_floor = _value_params[:id].present? ? BlockFloor.find(_value_params[:id]) : BlockFloor.new

						_floor.floors_text = _value_params[:floors_text]
						_floor.floors = _parseFloors _value_params[:floors_text]
						_floor.name = _value_params[:name]
						_floor.description = _value_params[:description]
						_floor.is_dynamic = _value_params[:is_dynamic]

						if _floor.is_dynamic
							_value_params[:surface] = JSON.parse _value_params[:surface]
							if _value_params[:surface]['is_new']
								TemporaryFile.get_file(_value_params[:surface]['id']) do |_image|
									_floor.surface = _image
								end
							end
						else
							_images = []
							if _value_params[:images].present?
								_value_params[:images].each do |_v|
									_value = JSON.parse _v

									if _value['is_new']
										TemporaryFile.get_file(_value['id']) do |_image|
											_images << BlockFloorImage.new(image: _image, order: _value['order'], description: _value['description'])
										end
									else
										_image = BlockFloorImage.find _value['id']
										_image.description = _value['description']
										_image.order = _value['order']         

										_images << _image
									end
								end
							end
							_floor.images = _images
						end

						_floors << _floor
					end

					assign_attributes floors: _floors

				# / Floor

				# Real-estate group

					_group_params = params[:group]
					_groups = []

					_group_params.each_value do |_value_params|
						_group = _value_params[:id].present? ? BlockRealEstateGroup.find(_value_params[:id]) : BlockRealEstateGroup.new

						_value_params[:bedroom_number] = ApplicationHelper.format_i _value_params[:bedroom_number] if _value_params[:bedroom_number].present?
						_value_params[:restroom_number] = ApplicationHelper.format_i _value_params[:restroom_number] if _value_params[:restroom_number].present?
						_value_params[:area] = ApplicationHelper.format_f _value_params[:area] if _value_params[:area].present?

						_group.name = _value_params[:name]
						_group.bedroom_number = _value_params[:bedroom_number]
						_group.restroom_number = _value_params[:restroom_number]
						_group.area = _value_params[:area]
						_group.description = _value_params[:description]

						# Real estate type
						_group.real_estate_type_id = _value_params[:real_estate_type_id]
						if _group.real_estate_type_id.blank?
							_group.real_estate_type_id = case BlockType.find(params[:block_type_id]).name
							when 'low_apartment'
								11
							when 'medium_apartment'
								10
							when 'high_apartment'
								9
							when 'social_home'
								14
							when 'adjacent_villa'
								12
							when 'adjacent_town_house'
								13
							when 'office'
								4
							when 'land'
								17
							end
						end

						# Images
						_images = []
						_has_avatar = false
						if _value_params[:images].present?
							_value_params[:images].each do |_v|
								_value = JSON.parse _v
								_value['is_avatar'] ||= false

								if _value['is_new']
									TemporaryFile.get_file(_value['id']) do |_image|
										_images << BlockRealEstateGroupImage.new(image: _image, is_avatar: _value['is_avatar'], order: _value['order'], description: _value['description'])

										_has_avatar = true if _value['is_avatar']
									end
								else
									_image = BlockRealEstateGroupImage.find _value['id']
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
						_group.images = _images

						# Update real-estate area, bedroom, area
						unless _group.new_record?
							_update_attributes = {}

							if _group.bedroom_number_changed? && _group.bedroom_number.present?
								_update_attributes[:bedroom_number] = _group.bedroom_number
							end

							if _group.restroom_number_changed? && _group.restroom_number.present?
								_update_attributes[:restroom_number] = _group.restroom_number
							end

							if _group.area_changed? && _group.area.present?
								_update_attributes[:campus_area] = _group.area_was
							end

							_group.real_estates.update_all _update_attributes if _update_attributes.keys.count > 0
						end

						_groups << _group
					end

					assign_attributes real_estate_groups: _groups

				# / Real-estate group

				assign_attributes params.permit [:name, :block_type_id, :description, :project_id]
			end

		# / Assign with params

		# Save with params

			def save_with_params params
				# Author
				# if new_record?
				# 	return { status: 6 } if User.current.cannot? :create, Blog
				# else
				# 	return { status: 6 } if User.current.cannot? :edit, self
				# end

				assign_attributes_with_params params

				if save
					{ status: 0 }
				else
					{ status: 2 }
				end
			end

		# / Save with params

	# / Insert

	# Delete

		def self.delete_by_id id
			if destroy id
				{ status: 0 }
			else
				{ status: 2 }
			end
		end

	# / Delete

	# Attributes

		# Block type
		def display_block_type
			@display_block_type ||= block_type.present? ? I18n.t("block_type.text.#{block_type.name}") : ''
		end

	# / Attributes

end