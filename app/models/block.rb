class Block < ActiveRecord::Base
	belongs_to :project

	has_many :item_groups
	has_many :items
	
	validates :name, presence: { message: 'Tên không được bỏ trống' }
	validates :description, presence: { message: 'Mô tả không được bỏ trống' }
	validates :direction_id, presence: { message: 'Hướng không được bỏ trống' }
	
	def self.save_block params
		block_params = get_block_params params
		
		block = create block_params
		
		block
	end
	
	def self.get_block_params params
		params[:floor_number] = 0
	
		fields = [:name, :description, :project_id, :floor_number, :direction_id]
		
		params.permit fields
	end

	def self.update_building params
		block = find(params[:id])

		block.floor_number = params[:floor_number]

		existed_items = JSON.parse(params[:items_list_existed])

		block.items.each do |item|
			if existed_items.include? item.id.to_s
				item.update(existed_items[item.id.to_s])
			else
				item.destroy
			end
		end

		block.items.create JSON.parse(params[:items_list])

		block.save
	end
end
