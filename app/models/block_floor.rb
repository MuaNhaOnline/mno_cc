class BlockFloor < ActiveRecord::Base

	# Attributes

	  has_attached_file :surface, 
	  	default_url: "/assets/block_floors/:style/default.png", 
	  	:path => ":rails_root/app/assets/file_uploads/block_floor_surfaces/:style/:id_:filename", 
	  	:url => "/assets/block_floor_surfaces/:style/:id_:filename"
	  validates_attachment_content_type :surface, content_type: /\Aimage\/.*\Z/

	# / Attributes

	# Associations

		has_many :surface_descriptions, class_name: 'BlockFloorSurfaceDescription'

	# / Associations

	# Save description

		def self.save_description id, descriptions_data
			# Get image
			floor = find id

			# Read each image
			descriptions_data.each do |data|

				# Create image description
				surface_descriptions = []

				# Read each description
				data['descriptions'].each do |description_data|
					surface_description = BlockFloorSurfaceDescription.new description_type: description_data['description']['type'], area_type: description_data['tag_name']

					# Area info
					case description_data['tag_name']
					when 'polyline'
						surface_description.area_info = { points: description_data['points'] }
					end

					# Description info
					case description_data['description']['type']
					when 'real_estate'
						surface_description.real_estate_description = BlockFloorSurfaceRealEstateDescription.new real_estate_id: description_data['description']['id']
					end

					surface_descriptions << surface_description
				end

				# Set & save
				floor.surface_descriptions = surface_descriptions
				floor.save
			end

			{ status: 0 }
		end

	# / Save description
end
