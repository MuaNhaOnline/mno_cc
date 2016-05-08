class LegalRecordType < ActiveRecord::Base

	serialize :options, JSON

	def self.get_options
		order order: 'ASC'
	end

	# Attributes
		
		# Name
		def display_name
			@display_name ||= I18n.t("legal_record_type.text.#{name}")
		end
	
	# / Attributes

end
