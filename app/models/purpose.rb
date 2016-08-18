class Purpose < ActiveRecord::Base

	serialize :options, JSON

	def self.get_options
		order order: 'ASC'
	end

	# Attributes

		# Class name
		def self.display_name
			I18n.t('purpose.text')
		end
		
		# Name
		def display_name is_demand = false
			I18n.t("#{is_demand ? 'demand' : 'purpose'}.name.#{name}")
		end
	
	# / Attributes

end
