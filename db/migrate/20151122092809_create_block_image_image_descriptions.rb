class CreateBlockImageImageDescriptions < ActiveRecord::Migration
  def change
    create_table :block_image_image_descriptions do |t|
    	t.integer :block_image_description_id
	    t.boolean 'is_avatar', default: false
	    t.text 'description'
	    t.integer 'order'
    end

    add_attachment :block_image_image_descriptions, :image
  end
end
