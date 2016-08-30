class BlogCategory < ActiveRecord::Base

	# Default
	
		default_scope { order('"name" asc') }
	
	# / Default

	# Associations
	
		has_many :blogs,
			foreign_key: 'category_id'
	
	# / Associations

	# Attributes
	
		def display_name
			self.name
		end
	
	# / Attributes

end
