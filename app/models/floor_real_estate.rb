class FloorRealEstate < ActiveRecord::Base

	# Associations
	
		belongs_to :real_estate
	
	# / Associations

	# Attributes
	
		# Price
		def display_sell_price
			@display_sell_price ||= sell_price_text
		end
		def display_rent_price
			@display_rent_price ||= rent_price_text
		end
	
	# / Attributes

end
