class Permission < ActiveRecord::Base

	# Default
	
		default_scope { order('"order" asc') }
	
	# / Default

	# Associations
	
		belongs_to :parent, class_name: 'Permission'

		has_many :childs, class_name: 'Permission', foreign_key: 'parent_permission_id'
	
	# / Associations

	# Attributes
	
	# / Attributes

end
