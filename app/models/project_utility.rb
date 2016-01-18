class ProjectUtility < ActiveRecord::Base

	# Associations

		has_many :images, class_name: 'ProjectUtilityImage'

	# / Associations

end
