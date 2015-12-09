class BlockRealEstateGroupsAddRestroomNumber < ActiveRecord::Migration
  def change
  	add_column :block_real_estate_groups, :restroom_number, :integer
  end
end
