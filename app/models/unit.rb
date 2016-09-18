class Unit < ActiveRecord::Base
	
	serialize :options, JSON

	def self.get_options
		order order: 'ASC'
	end

	# Atrributes
	
		def display_name
			I18n.t "unit.name.#{name}"
		end
	
	# / Atrributes

end
