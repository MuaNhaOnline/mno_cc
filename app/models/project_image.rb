class ProjectImage < ActiveRecord::Base

	# Image

	  has_attached_file :image, 
	  	styles: { thumb: '260x195#', slide: '960x540#' },
	  	default_url: "/assets/projects/:style/default.png", 
	  	:path => ":rails_root/app/assets/file_uploads/project_images/:style/:id_:filename", 
	  	:url => "/assets/project_images/:style/:id_:filename"
	  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

	# / Image

	# Defaults

  	default_scope { order('is_avatar desc, "order" asc') }

  # /Defaults

	# Associations

		has_many :image_descriptions, class_name: 'ProjectImageDescription'

	# / Associations

	# Save description

		def self.save_description images_data
			# Read each image
			images_data.each do |data|
				# Get image
				project_image = find data['id']

				# Create image description
				_image_descriptions = []

				# Read each description
				data['descriptions'].each do |description_data|
					_image_description = ProjectImageDescription.new description_type: description_data['description']['type'], area_type: description_data['tag_name']

					# Area info
					case description_data['tag_name']
					when 'polyline'
						_image_description.area_info = { points: description_data['points'] }
					end

					# Description info
					case description_data['description']['type']
					when 'block'
						_image_description.block_description = ProjectImageBlockDescription.new block_id: description_data['description']['id']
					end

					_image_descriptions << _image_description
				end

				# Set & save
				project_image.image_descriptions = _image_descriptions
				project_image.save
			end

			{ status: 0 }
		end

	# / Save description

end