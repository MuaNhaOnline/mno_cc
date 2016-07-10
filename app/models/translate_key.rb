=begin
	object_type
		1	RealEstateType.name
=end

class TranslateKey < ActiveRecord::Base
	self.primary_keys = :object_type, :key
end
