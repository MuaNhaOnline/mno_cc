class RealEstateType < ActiveRecord::Base

	# Default
	
		default_scope { order('"order" asc') }
	
	# / Default

	# Associations

		has_many :translate_names, -> { where("translate_values.object_type = #{RealEstateType.name_translate_type}") }, class_name: 'TranslateValue', primary_key: :key, foreign_key: :name

		belongs_to :translate_name, -> { where("translate_values.object_type = #{RealEstateType.name_translate_type}") }, class_name: 'TranslateValue', primary_key: :key, foreign_key: :name

		accepts_nested_attributes_for :translate_name

	# / Associations

	# PgSearch

		include PgSearch
		pg_search_scope :search,
			against: 		:meta_search,
			using: 			{
								:tsearch => { prefix: true }
							}

	# / PgSearch

	# Get

		def self.get_options
			order order: 'ASC'
		end
	
	# / Get

	# Attributes

		serialize :options, JSON

		# Class name
		def self.display_name
			I18n.t 'real_estate_type.text'
		end

		# Translate object
		def name_translate_type
			1
		end
		def self.name_translate_type
			1
		end
		
		# Name
		def display_name
			@display_name ||= I18n.t("real_estate_type.name.#{name}")
		end
	
	# / Attributes

end