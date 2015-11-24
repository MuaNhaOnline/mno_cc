class ProjectImageDescription < ActiveRecord::Base

	# Attributes

  	serialize :area_info, JSON

	# / Attributes

	# Associations

		has_one :block_description, class_name: 'ProjectImageBlockDescription'
		has_one :text_description, class_name: 'ProjectImageTextDescription'

		has_many :image_descriptions, class_name: 'ProjectImageImageDescription'

	# / Associations

end
