class TranslateValue < ActiveRecord::Base
	default_scope { where("translate_values.language = '#{self.language}'") }

	self.primary_keys = :object_type, :key, :language

	# Attributes
	
		def self.language
			@language || 'vn'
		end

		def self.language= language
			@language = language
		end
	
	# / Attributes

	# Get
	
		def self.get object_type, key
			self.where(object_type: object_type, key: key).first || TranslateValue.new(text: key)
		end
	
	# / Get
end
