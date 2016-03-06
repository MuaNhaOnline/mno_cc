class SystemGroup < ActiveRecord::Base

	# Association
	
		has_and_belongs_to_many :users
		has_and_belongs_to_many :permissions
	
	# / Association

end
