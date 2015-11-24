class BlockFloorSurfaceDescription < ActiveRecord::Base

	# Attributes

  	serialize :area_info, JSON

	# / Attributes

	# Associations
	
		has_one :real_estate_description, class_name: 'RealEstateDescription'

	# / Associations

end
