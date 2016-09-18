class PropertyUtility < ActiveRecord::Base
	
	serialize :options, JSON

	def self.get_options
		order order: 'ASC'
	end

	# Attributes
	
		def display_name
			@display_name ||= name.present? ? I18n.t("property_utility.name.#{name}") : ''
		end
	
	# / Attributes

end
