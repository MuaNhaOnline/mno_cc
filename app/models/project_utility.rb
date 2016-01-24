class ProjectUtility < ActiveRecord::Base

	# Associations

		has_many :images, class_name: 'ProjectUtilityImage'

	# / Associations

	# Attributes
	
		# Description
		def display_description
			@display_description ||= description.html_safe
		end
	
	# / Attributes

end
