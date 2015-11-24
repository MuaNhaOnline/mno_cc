class CreateBlockRealEstateGroupImageTextDescriptions < ActiveRecord::Migration
  def change
    create_table :block_real_estate_group_image_text_descriptions do |t|
    	t.integer :block_real_estate_group_image_description_id
    	t.text :description
    end
  end
end
