class CreateBlocksTable < ActiveRecord::Migration
  def change
    rename_table :table_item_groups, :item_groups

    rename_column :item_groups, :title, :name

    create_table :blocks do |t|
      t.text :name
      t.text :description
      t.integer :project_id
      t.integer :floor_number
      t.integer :direction_id
    end
  end
end
