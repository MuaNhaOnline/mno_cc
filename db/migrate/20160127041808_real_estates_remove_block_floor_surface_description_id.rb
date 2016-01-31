class RealEstatesRemoveBlockFloorSurfaceDescriptionId < ActiveRecord::Migration
  def change
  	remove_column :real_estates, :block_floor_surface_description_id
  end
end
