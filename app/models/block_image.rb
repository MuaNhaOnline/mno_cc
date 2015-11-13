class BlockImage < ActiveRecord::Base

	# Image

	  has_attached_file :image, 
	  	styles: { thumb: '360x270#' },
	  	default_url: "/assets/blocks/:style/default.png", 
	  	:path => ":rails_root/app/assets/file_uploads/block_images/:style/:id_:filename", 
	  	:url => "/assets/block_images/:style/:id_:filename"
	  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

	# / Image

	# Defaults

  	default_scope { order('is_avatar desc, "order" asc') }

	# / Defaults

	# Associations

		has_many :image_descriptions, class_name: 'BlockImageDescription'

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
					_image_description = BlockImageDescription.new description_type: description_data['description']['type'], area_type: description_data['tag_name']

					# Area info
					case description_data['tag_name']
					when 'polyline'
						_image_description.area_info = { points: description_data['points'] }
					end

					# Description info
					case description_data['description']['type']
					when 'block'
						_image_description.block_description = BlockImageBlockDescription.new block_id: description_data['description']['id']
					when 'real_estate'
						_image_description.real_estate_description = BlockImageRealEstateDescription.new real_estate_id: description_data['description']['id']
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