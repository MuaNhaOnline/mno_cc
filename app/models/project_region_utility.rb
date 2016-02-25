class ProjectRegionUtility < ActiveRecord::Base

	# Associations

		has_many :images, class_name: 'ProjectRegionUtilityImage', autosave: true, dependent: :destroy

	# / Associations

	# Attributes
	
		def display_description
			@display_description ||= description.present? ? description.html_safe : ''
		end
	
	# / Attributes

end
