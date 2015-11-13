class Blog < ActiveRecord::Base
	
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
				assign_attributes params.permit [:title, :content]
			end

		# / Assign with params

		# Save with params

			def save_with_params params
				# Author
				if new_record?
					return { status: 6 } if User.current.cannot? :create, Blog
				else
					return { status: 6 } if User.current.cannot? :edit, self
				end

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

			return { status: 6 } if User.current.cannot? :delete, blog

			if delete id
				{ status: 0 }
			else
				{ status: 2}
			end
		end

	# / Delete

end