class CreateBlockRealEstateGroups < ActiveRecord::Migration
  def change
    create_table :block_real_estate_groups do |t|
    	t.integer :name
    	t.integer :block_id
    	t.integer :bedroom_number
    	t.decimal :area
    end

    add_column :real_estates, :block_real_estate_group_id, :integer
  end
end
