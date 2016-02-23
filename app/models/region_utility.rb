class RegionUtility < ActiveRecord::Base

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

	def display_name
		@display_name ||= name.present? ? I18n.t("region_utility.text.#{name}") : ''
	end

end
