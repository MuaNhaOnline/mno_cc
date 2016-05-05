class PlanningStatusType < ActiveRecord::Base

	serialize :options, JSON

	def self.get_options
		order order: 'ASC'
	end

end
