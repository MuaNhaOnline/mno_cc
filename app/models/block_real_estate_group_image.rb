class BlockRealEstateGroupImage < ActiveRecord::Base

	# Attributes

	  has_attached_file :image, 
	  	styles: { thumb: '360x270#', slide: '800x450#' },
	  	default_url: "/assets/real_estates/:style/default.png", 
	  	:path => ":rails_root/app/assets/file_uploads/block_real_estate_group_images/:style/:id_:filename", 
	  	:url => "/assets/block_real_estate_group_images/:style/:id_:filename"
	  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

	# / Attributes

	# Defaults

  	default_scope { order('is_avatar desc, "order" asc') }

	# / Defaults

	# Associations

		has_many :image_descriptions, class_name: 'BlockRealEstateGroupImageDescription'

	# / Associations

	# Save description

		def self.save_description images_data
			# Read each image
			images_data.each do |data|
				# Get image
				group_image = find data['id']

				# Create image description
				_image_descriptions = []

				# Read each description
				data['descriptions'].each do |description_data|
					_image_description = BlockRealEstateGroupImageDescription.new description_type: description_data['description']['type'], area_type: description_data['tag_name']

					# Area info
					case description_data['tag_name']
					when 'polyline'
						_image_description.area_info = { points: description_data['points'] }
					end

					# Description info
					case description_data['description']['type']
					when 'text_image'
						_data =  description_data['description']['data']

						return unless _data.instance_of? String
						
						_data = Rack::Utils.parse_nested_query _data

						if _data['description'].present?
							_image_description.text_description = BlockRealEstateGroupImageTextDescription.new description: _data['description']
						end

						if _data['images'].present?
							_images = []
							_data['images'].each do |_image_data|
		            _image_data = JSON.parse _image_data
		            _image_data['is_avatar'] ||= false

		            if _image_data['is_new']
		              TemporaryFile.get_file(_image_data['id']) do |_image|
		                _images << BlockRealEstateGroupImageImageDescription.new(image: _image, is_avatar: _image_data['is_avatar'], order: _image_data['order'], description: _image_data['description'])

		                _has_avatar = true if _image_data['is_avatar']
		              end
		            else
		              _image = BlockRealEstateGroupImageImageDescription.find _image_data['id']
		              _image.description = _image_data['description']
		              _image.is_avatar = _image_data['is_avatar']
		              _image.order = _image_data['order']
		              _image.save if _image.changed?          

		              _has_avatar = true if _image_data['is_avatar']

		              _images << _image
		            end
							end
							_image_description.image_descriptions = _images
						end
					end

					_image_descriptions << _image_description
				end

				# Set & save
				group_image.image_descriptions = _image_descriptions
				group_image.save
			end

			{ status: 0 }
		end

	# / Save description
  
end
