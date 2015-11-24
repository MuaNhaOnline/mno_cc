class BlockRealEstateGroupAddDescription < ActiveRecord::Migration
  def change
  	add_column :block_real_estate_groups, :description, :text
  end
end
