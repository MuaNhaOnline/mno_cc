class CreateBlockImageRealEstateDescriptions < ActiveRecord::Migration
  def change
    create_table :block_image_real_estate_descriptions do |t|
    	t.integer :block_image_description_id
    	t.integer :real_estate_id
    end
  end
end
