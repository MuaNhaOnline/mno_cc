class District < ActiveRecord::Base

	default_scope { order('"order" asc, name asc') }

	# Callback
	
		before_save :get_next_order

		def get_next_order
			if self.new_record?
				# Get next order
				last_order_district = District.where(province_id: self.province_id).last
				self.order =
					last_order_district.present? ?
						(last_order_district.order || 0) + 1 :
						1
			end
		end
	
	# / Callback

	# Save
	
		# Set order
		def set_order new_order
			new_order = new_order.to_i
			old_order = self.order

			if old_order < new_order
				change = '- 1'
				order_range = [old_order + 1, new_order]
			else
				change = '+ 1'
				order_range = [new_order, old_order - 1]
			end

			ActiveRecord::Base.connection.execute(
				' UPDATE districts' +
				" SET \"order\" = \"order\" #{change}" +
				" WHERE province_id = #{self.province_id} AND \"order\" BETWEEN #{order_range[0]} AND #{order_range[1]}"
			);

			if !self.update order: new_order
				return { status: 2 }
			end

			{ status: 0 }
		end
	
	# / Save

end