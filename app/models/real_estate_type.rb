class RealEstateType < ActiveRecord::Base

	default_scope { order('"order" asc') }

	serialize :options, JSON

	def self.get_options
		order order: 'ASC'
	end

	# Attributes
		
		# Name
		def display_name
			@display_name ||= I18n.t("real_estate_type.text.#{name}")
		end
	
	# / Attributes

end
