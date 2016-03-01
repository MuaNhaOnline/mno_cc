class BlocksAddFloorNumber < ActiveRecord::Migration
  def change
  	add_column :blocks, :floor_number, :integer
  end
end
