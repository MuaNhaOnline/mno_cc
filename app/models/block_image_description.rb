class BlockImageDescription < ActiveRecord::Base

	# Attributes

  	serialize :area_info, JSON

	# / Attributes

	# Associations

		# has_one :text_description, class_name: 'BlockImageTextDescription'
		has_one :real_estate_description, class_name: 'BlockImageRealEstateDescription'
		has_one :block_description, class_name: 'BlockImageBlockDescription'

		# has_many :image_descriptions, class_name: 'BlockImageImageDescription'

	# / Associations

end
