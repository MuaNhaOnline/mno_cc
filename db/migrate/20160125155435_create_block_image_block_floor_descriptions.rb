class CreateBlockImageBlockFloorDescriptions < ActiveRecord::Migration
  def change
    create_table :block_image_block_floor_descriptions do |t|
    	t.integer :block_image_description_id
    	t.integer :block_floor_id
    end
  end
end
