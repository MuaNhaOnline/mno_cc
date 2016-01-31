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
				params[:block_type_id] = params[:detail_block_type_id].present? ? params[:detail_block_type_id] : params[:block_type_id]

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

					_floor_params = params[:floor]
					_floors = []

					_floor_params.each_value do |_value_params|
						_floor = _value_params[:id].present? ? BlockFloor.find(_value_params[:id]) : BlockFloor.new

						_floor.floors_text = _value_params[:floors_text]
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
						
						_group.name = _value_params[:name]
						_group.bedroom_number = ApplicationHelper.format_i _value_params[:bedroom_number] if _value_params[:bedroom_number].present?
						_group.restroom_number = ApplicationHelper.format_i _value_params[:restroom_number] if _value_params[:restroom_number].present?
						_group.area = ApplicationHelper.format_f _value_params[:area] if _value_params[:area].present?
						_group.real_estate_type_id = _value_params[:real_estate_type_id] if _value_params[:real_estate_type_id].present?
						_group.description = _value_params[:description] if _value_params[:description].present?

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

end