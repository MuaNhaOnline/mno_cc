class Block < ActiveRecord::Base

	# Associates
  
		belongs_to :project

  	has_many :images, class_name: 'BlockImage'

	# / Associates

	# Validates

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

	# / Validates

	# Insert

		# Assign with params

			def assign_attributes_with_params params

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

				assign_attributes params.permit [:name, :description, :project_id]
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