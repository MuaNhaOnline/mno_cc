class BlockRealEstateGroup < ActiveRecord::Base
	
	# Associations

		belongs_to :block
		belongs_to :real_estate_type	

		has_many :images, class_name: 'BlockRealEstateGroupImage', dependent: :destroy, autosave: true
		has_many :real_estates, dependent: :destroy

	# / Associations

	# Attributes
	
		def display_area
			@display_area ||= area.present? ? ApplicationHelper.display_decimal(area) : ''
		end
	
	# / Attributes

end
