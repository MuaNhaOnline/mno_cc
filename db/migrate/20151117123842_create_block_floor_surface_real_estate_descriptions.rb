class CreateBlockFloorSurfaceRealEstateDescriptions < ActiveRecord::Migration
  def change
    create_table :block_floor_surface_real_estate_descriptions do |t|
    	t.integer :block_floor_surface_description_id
    	t.integer :real_estate_id
    end
  end
end
