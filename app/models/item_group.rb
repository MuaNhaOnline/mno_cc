class ItemGroup < ActiveRecord::Base
	belongs_to :block

	def self.save_item_group params
		item_group_params = get_item_group_params params

		item_group = create item_group_params

		item_group
	end

	def self.get_item_group_params params
		fields = [
			:name, :description, :block_id,
			:restroom_number, :bedroom_number, :using_area, :width_x, :width_y
		]

		params.permit fields
	end
end
