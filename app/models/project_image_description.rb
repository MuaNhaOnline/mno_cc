class ProjectImageDescription < ActiveRecord::Base

	# Attributes

  	serialize :area_info, JSON

	# / Attributes

	# Associations

		has_one :block_description, class_name: 'ProjectImageBlockDescription'

	# / Associations

end
