class ProjectImageDescription < ActiveRecord::Base

	# Attributes

  	serialize :area_info, JSON

	# / Attributes

	# Associations

		has_one :block_description, class_name: 'ProjectImageBlockDescription', dependent: :destroy
		has_one :text_description, class_name: 'ProjectImageTextDescription', dependent: :destroy

		has_many :image_descriptions, class_name: 'ProjectImageImageDescription', dependent: :destroy

	# / Associations

end
