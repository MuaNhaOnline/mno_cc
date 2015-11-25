class BlockRealEstateGroupsChangeTypeName < ActiveRecord::Migration
  def change
  	change_column :block_real_estate_groups, :name, :text
  end
end
