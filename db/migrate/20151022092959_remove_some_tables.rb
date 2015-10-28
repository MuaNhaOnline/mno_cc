class RemoveSomeTables < ActiveRecord::Migration
  def change
  	drop_table :blocks
  	drop_table :item_groups
  	drop_table :items
  end
end
