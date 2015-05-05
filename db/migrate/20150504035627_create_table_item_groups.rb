class CreateTableItemGroups < ActiveRecord::Migration
  def change
    create_table :table_item_groups do |t|
      t.text :title
      t.text :description
      t.decimal :using_area
      t.integer :restroom_number
      t.integer :bedroom_number
      t.decimal :width_x
      t.decimal :width_y
      t.text :options
    end
  end
end
