class District < ActiveRecord::Base
	default_scope { order('"order" asc, name asc') }
end
