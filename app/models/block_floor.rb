class BlockFloor < ActiveRecord::Base

	# Attributes

		has_attached_file :surface, 
			styles: { thumb: '360x270#' },
			default_url: "/assets/block_floors/:style/default.png", 
			:path => ":rails_root/app/assets/file_uploads/block_floor_surfaces/:style/:id_:filename", 
			:url => "/assets/block_floor_surfaces/:style/:id_:filename"
		validates_attachment_content_type :surface, content_type: /\Aimage\/.*\Z/

	# / Attributes

	# Associations

		belongs_to :block

		has_many :surface_descriptions, class_name: 'BlockFloorSurfaceDescription', dependent: :destroy, autosave: true
		has_many :real_estates

	# / Associations

	# Save description

		def self.save_description surface_data
			# Read each image
			surface_data.each do |data|
				# Get image
				floor = find data['id']

				# Create image description
				_surface_descriptions = []

				# Read each description
				data['descriptions'].each do |description_data|
					_surface_description = description_data['id'].present? ? BlockFloorSurfaceDescription.find(description_data['id']) : BlockFloorSurfaceDescription.new
					_surface_description.description_type = description_data['description']['type']
					_surface_description.area_type = description_data['tag_name']

					# Area info
					case description_data['tag_name']
					when 'polyline'
						_surface_description.area_info = { points: description_data['points'] }
					end

					# Description info
					case description_data['description']['type']
					when 'real_estate'
						_surface_description.real_estate_description = BlockFloorSurfaceRealEstateDescription.new real_estate_id: description_data['description']['id']
					when 'text_image'
						_data =  description_data['description']['data']

						return unless _data.instance_of? String
						
						_data = Rack::Utils.parse_nested_query _data

						if _data['description'].present?
							_surface_description.text_description = BlockFloorSurfaceTextDescription.new description: _data['description']
						end

						if _data['images'].present?
							_images = []
							_data['images'].each do |_image_data|
								_image_data = JSON.parse _image_data
								_image_data['is_avatar'] ||= false

								if _image_data['is_new']
									TemporaryFile.get_file(_image_data['id']) do |_image|
										_images << BlockFloorSurfaceImageDescription.new(image: _image, is_avatar: _image_data['is_avatar'], order: _image_data['order'], description: _image_data['description'])

										_has_avatar = true if _image_data['is_avatar']
									end
								else
									_image = BlockFloorSurfaceImageDescription.find _image_data['id']
									_image.description = _image_data['description']
									_image.is_avatar = _image_data['is_avatar']
									_image.order = _image_data['order']
									_image.save if _image.changed?          

									_has_avatar = true if _image_data['is_avatar']

									_images << _image
								end
							end
							_surface_description.image_descriptions = _images
						end
					end

					_surface_descriptions << _surface_description
				end

				# Set & save
				floor.surface_descriptions = _surface_descriptions
				floor.save
			end

			{ status: 0 }
		end
		
		def self.add_description id, type, value
			description = BlockFloorSurfaceDescription.find id

			case type
			when 'real_estate'
				description.real_estate_description = BlockFloorSurfaceRealEstateDescription.new real_estate_id: value
			end

			description.save
		end

	# / Save description
end
