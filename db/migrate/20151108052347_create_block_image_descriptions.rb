class CreateBlockImageDescriptions < ActiveRecord::Migration
  def change
    create_table :block_image_descriptions do |t|
    	t.integer :block_image_id
    	t.text :area_type
    	t.text :area_info
    	t.text :description_type
    end
  end
end
