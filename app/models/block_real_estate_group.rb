class BlockRealEstateGroup < ActiveRecord::Base
	
	# Associations

		belongs_to :block
		belongs_to :real_estate_type	

		has_many :images, class_name: 'BlockRealEstateGroupImage', dependent: :destroy
		has_many :real_estates, dependent: :destroy

	# / Associations

end
