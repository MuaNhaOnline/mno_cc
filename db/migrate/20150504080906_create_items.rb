class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.integer :item_group_id
      t.integer :block_id
      t.integer :floor_number
      t.integer :position
      t.text :description
    end
  end
end
