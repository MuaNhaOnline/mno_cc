class RealEstateType < ActiveRecord::Base

	default_scope { order('"order" asc') }

	def options_hash
		@options_hash
	end
	def options_hash= options_hash
		@options_hash = options_hash
	end

	after_find do |this|
		begin
			this.options_hash = JSON.parse(this.options)
		rescue

		end
	end

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
