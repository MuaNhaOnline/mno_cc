class BlockFloorAddIsDynamic < ActiveRecord::Migration
  def change
  	add_column :block_floors, :is_dynamic, :boolean
  end
end
