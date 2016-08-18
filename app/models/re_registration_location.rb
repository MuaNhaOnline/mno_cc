class ReRegistrationLocation < ActiveRecord::Base
	belongs_to :province, foreign_key: :object_id
	belongs_to :district, foreign_key: :object_id
	belongs_to :street, foreign_key: :object_id
end
