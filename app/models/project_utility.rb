class ProjectUtility < ActiveRecord::Base

	# Associations

		has_many :images, class_name: 'ProjectUtilityImage', autosave: true, dependent: :destroy

	# / Associations

	# Attributes
	
		# Description
		def display_description
			@display_description ||= description.present? ? description.html_safe : ''
		end
	
	# / Attributes

end
