class BlockImageDescription < ActiveRecord::Base

	# Attributes

  	serialize :area_info, JSON

	# / Attributes

	# Associations

		has_one :text_description, class_name: 'BlockImageTextDescription', dependent: :destroy
		has_one :real_estate_description, class_name: 'BlockImageRealEstateDescription', dependent: :destroy
		has_one :block_description, class_name: 'BlockImageBlockDescription', dependent: :destroy
		has_one :block_floor_description, class_name: 'BlockImageBlockFloorDescription', dependent: :destroy

		has_many :image_descriptions, class_name: 'BlockImageImageDescription', dependent: :destroy

	# / Associations

end
