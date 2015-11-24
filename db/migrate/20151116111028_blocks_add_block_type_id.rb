class BlocksAddBlockTypeId < ActiveRecord::Migration
  def change
  	add_column :blocks, :block_type_id, :integer
  end
end
