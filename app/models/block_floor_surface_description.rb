class BlockFloorSurfaceDescription < ActiveRecord::Base

	# Attributes

  	serialize :area_info, JSON

	# / Attributes

	# Associations
	
		has_one :real_estate_description, class_name: 'BlockFloorSurfaceRealEstateDescription'
		has_one :text_description, class_name: 'BlockFloorSurfaceTextDescription'

		has_many :image_descriptions, class_name: 'BlockFloorSurfaceImageDescription'

	# / Associations

end
