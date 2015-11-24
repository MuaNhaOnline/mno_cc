class BlockRealEstateGroupImageDescription < ActiveRecord::Base

	# Attributes

  	serialize :area_info, JSON

	# / Attributes

	# Associations

		has_one :text_description, class_name: 'BlockRealEstateGroupImageTextDescription'

		has_many :image_descriptions, class_name: 'BlockRealEstateGroupImageImageDescription'

	# / Associations

end
