class ReRegistrationLocation < ActiveRecord::Base
	belongs_to :province, foreign_key: :object_id
	belongs_to :district, foreign_key: :object_id
	belongs_to :street, foreign_key: :object_id

	def display
		address = []
		case self.object_type
		when 'province'
			address << self.province.name
		when 'district'
			address << self.district.name
			address << self.district.province.name
		when 'street'
			address << self.street.name
			address << self.street.district.name
			address << self.street.district.province.name
		end
		address.join ', '
	end
end
