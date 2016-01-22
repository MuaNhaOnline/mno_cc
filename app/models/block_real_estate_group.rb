class BlockRealEstateGroup < ActiveRecord::Base
	
	# Associations

		belongs_to :block
		belongs_to :real_estate_type	

		has_many :images, class_name: 'BlockRealEstateGroupImage'
		has_many :real_estates

	# / Associations

end
