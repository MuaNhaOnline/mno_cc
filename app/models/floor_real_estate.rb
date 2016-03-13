class FloorRealEstate < ActiveRecord::Base

	# Associations
	
		belongs_to :real_estate
	
	# / Associations

	# Attributes

		# Call name
		def display_call_name
			@display_call_name ||= 
			real_estate.real_estate_type.present? ? 
			case real_estate.real_estate_type.name
			when 'land'
				'Nền'
			else
				'Căn'
			end
			:
			''
		end

		# Name
		def display_name
			@display_name ||= "#{display_call_name} #{label}"
		end
	
		# Price
		def display_sell_price
			@display_sell_price ||= sell_price_text
		end
		def display_rent_price
			@display_rent_price ||= rent_price_text
		end
	
	# / Attributes

end
