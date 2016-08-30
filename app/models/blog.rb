class Blog < ActiveRecord::Base

	# Default
	
		default_scope { order('"created_at" desc') }
	
	# / Default

	# Associations

		belongs_to 	:category,
			class_name: 'BlogCategory'
	
		has_and_belongs_to_many :tags,
			autosave: 		true,
			dependent: 		:delete_all
		has_and_belongs_to_many :relative_res,
			class_name:	'RealEstate',
			autosave:	true

		has_attached_file :image, 
			# Slide: 1.52
			styles: { thumb: '200x112#' },
			default_url: "/assets/blogs/:style/default.png", 
			:path => ":rails_root/app/assets/file_uploads/blog_images/:style/:id_:filename", 
			:url => "/assets/blog_images/:style/:id_:filename"
		validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/
	
	# / Associations
	
	# Validations

		validate :custom_validate

		def custom_validate
			# Title
			if title.blank?
				errors.add :title, 'Tiêu đề không thể bỏ trống'
				return
			end

			# Content
			if content.blank?
				errors.add :content, 'Nội dung không thể bỏ trống'
				return
			end
		end

	# / Validations

	# Insert

		# Assign with params

			def assign_attributes_with_params params
				# Tags
				if params[:tags].present?
					params[:tag_ids] = []

					params[:tags].each do |text|
						next if text.blank?
						params[:tag_ids] << Tag.find_or_create_by(text: text).id
					end
				end

				# Image
				if params[:image].present?
					value = JSON.parse params[:image]

					if value['is_new']
						TemporaryFile.get_file(value['id']) do |image|
							self.image = image
						end
					end
				else
					self.image = nil
				end

				assign_attributes params.permit [:title, :content, :category_id,
					tag_ids: [], relative_re_ids: []]
			end

		# / Assign with params

		# Save with params

			def save_with_params params

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
			blog = find(id)

			if delete id
				{ status: 0 }
			else
				{ status: 2}
			end
		end

	# / Delete

	# Class attributes

		def self.i18n_attribute key
			I18n.t 'blog.attributes.' + key
		end
	
	# / Class attributes

end