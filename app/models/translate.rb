class Translate < ActiveRecord::Base
	self.primary_keys = :object_type, :key, :language
end
