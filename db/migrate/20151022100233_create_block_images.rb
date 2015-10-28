class CreateBlockImages < ActiveRecord::Migration
  def change
    create_table :block_images do |t|
    	t.integer :blick_id
    	t.boolean :is_avatar, default: false
    	t.text :description
    end

    add_attachment :block_images, :image
  end
end
