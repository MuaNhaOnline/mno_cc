class CreateBlockFloorSurfaceDescriptions < ActiveRecord::Migration
  def change
    create_table :block_floor_surface_descriptions do |t|
    	t.integer :block_floor_id
    	t.text :area_type
    	t.text :area_info
    	t.text :description_type
    end
  end
end
