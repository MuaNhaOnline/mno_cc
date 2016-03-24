module ActiveRecordExtensions
	def page page, per
		offset = (page - 1) * per
		limit(per).offset(offset)
	end

	def random
		order('RANDOM()')
	end
end
ActiveRecord::Base.extend ActiveRecordExtensions