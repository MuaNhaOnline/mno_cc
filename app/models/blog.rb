class Blog < ActiveRecord::Base

	# Associations
	
		has_and_belongs_to_many :tags,
			autosave: 		true,
			dependent: 		:delete_all
	
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
				if params[:tags].present?
					params[:tag_ids] = []

					params[:tags].each do |text|
						next if text.blank?
						params[:tag_ids] << Tag.find_or_create_by(text: text).id
					end
				end

				assign_attributes params.permit [:title, :content, tag_ids: []]
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