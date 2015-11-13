class CreateBlockImageBlockDescriptions < ActiveRecord::Migration
  def change
    create_table :block_image_block_descriptions do |t|
    	t.integer :block_image_description_id
    	t.integer :block_id
    end
  end
end
