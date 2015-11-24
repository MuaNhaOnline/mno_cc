class BlockRealEstateGroupsAddRealEstateTypeId < ActiveRecord::Migration
  def change
  	add_column :block_real_estate_groups, :real_estate_type_id, :integer
  end
end
