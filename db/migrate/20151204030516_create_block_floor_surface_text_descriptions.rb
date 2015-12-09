class CreateBlockFloorSurfaceTextDescriptions < ActiveRecord::Migration
  def change
    create_table :block_floor_surface_text_descriptions do |t|
  		t.integer :block_floor_surface_description_id
  		t.text :description
    end
  end
end
