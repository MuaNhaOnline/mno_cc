class ConstructionalLevel < ActiveRecord::Base
	
	serialize :options, JSON

	def self.get_options
		order order: 'ASC'
	end

	# Attributes
	
		def display_name
			I18n.t "constructional_level.name.#{name}"
		end
	
	# / Attributes
end