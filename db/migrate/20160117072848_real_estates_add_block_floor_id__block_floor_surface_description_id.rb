class RealEstatesAddBlockFloorIdBlockFloorSurfaceDescriptionId < ActiveRecord::Migration
  def change
  	add_column :real_estates, :block_floor_id, :integer
  	add_column :real_estates, :block_floor_surface_description_id, :integer
  end
end
