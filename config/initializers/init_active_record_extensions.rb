module ActiveRecordExtensions
	def page page, per, params = {}
		offset = (page.to_i - 1) * per
		limit(per).offset(offset)
	end

	def random
		order('RANDOM()')
	end
end
ActiveRecord::Base.extend ActiveRecordExtensions