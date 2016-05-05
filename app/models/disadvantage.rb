class Disadvantage < ActiveRecord::Base
	
	serialize :options, JSON

	def self.get_options
		order order: 'ASC'
	end

	def display_name
		@display_name ||= name.present? ? I18n.t("disadvantage.text.#{name}") : ''
	end

end
