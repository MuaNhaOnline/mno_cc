class BlockImage < ActiveRecord::Base

	# Attributes

		has_attached_file :image, 
			styles: { thumb: '360x270#' },
			default_url: "/assets/blocks/:style/default.png", 
			:path => ":rails_root/app/assets/file_uploads/block_images/:style/:id_:filename", 
			:url => "/assets/block_images/:style/:id_:filename"
		validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

	# / Attributes

	# Defaults

		default_scope { order('is_avatar desc, "order" asc') }

	# / Defaults

	# Associations

		has_many :image_descriptions, class_name: 'BlockImageDescription', dependent: :destroy, autosave: true

	# / Associations

	# Save description

		def self.save_description images_data
			# Read each image
			images_data.each do |data|
				# Get image
				block_image = find data['id']

				# Create image description
				_image_descriptions = []

				# Read each description
				data['descriptions'].each do |description_data|
					_image_description = description_data['id'].present? ? BlockImageDescription.find(description_data['id']) : BlockImageDescription.new
					# Reset description object
					case _image_description.area_type
					when 'real_estate'
						_image_description.real_estate_description = nil
					when 'block_floor'
						_image_description.block_floor_description = nil
					when 'text_image'
						_image_description.text_description = nil
						_image_description.images_description = nil
					end unless _image_description.new_record?

					_image_description.description_type = description_data['description']['type']
					_image_description.area_type = description_data['tag_name']

					# Area info
					case description_data['tag_name']
					when 'polyline'
						_image_description.area_info = { points: description_data['points'] }
					end

					# Description info
					case description_data['description']['type']
					when 'real_estate'
						_image_description.real_estate_description = BlockImageRealEstateDescription.new real_estate_id: description_data['description']['id']
					when 'block_floor'
						_image_description.block_floor_description = BlockImageBlockFloorDescription.new block_floor_id: description_data['description']['id']
					when 'text_image'
						_data =  description_data['description']['data']

						return unless _data.instance_of? String
						
						_data = Rack::Utils.parse_nested_query _data

						if _data['description'].present?
							_image_description.text_description = BlockImageTextDescription.new description: _data['description']
						end

						if _data['images'].present?
							_images = []
							_data['images'].each do |_image_data|
								_image_data = JSON.parse _image_data
								_image_data['is_avatar'] ||= false

								if _image_data['is_new']
									TemporaryFile.get_file(_image_data['id']) do |_image|
										_images << BlockImageImageDescription.new(image: _image, is_avatar: _image_data['is_avatar'], order: _image_data['order'], description: _image_data['description'])

										_has_avatar = true if _image_data['is_avatar']
									end
								else
									_image = BlockImageImageDescription.find _image_data['id']
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
				block_image.image_descriptions = _image_descriptions
				block_image.save
			end

			{ status: 0 }
		end

	# / Save description

end