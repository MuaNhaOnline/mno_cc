class Purpose < ActiveRecord::Base

	serialize :options, JSON

	def self.get_options
		order order: 'ASC'
	end

	# Attributes
		
		# Name
		def display_name is_demand = false
			I18n.t("#{is_demand ? 'demand' : 'purpose'}.text.#{name}")
		end
	
	# / Attributes

end
