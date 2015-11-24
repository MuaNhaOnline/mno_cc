class CreateBlockImageTextDescriptions < ActiveRecord::Migration
  def change
    create_table :block_image_text_descriptions do |t|
    	t.integer :block_image_description_id
    	t.text :description
    end
  end
end
