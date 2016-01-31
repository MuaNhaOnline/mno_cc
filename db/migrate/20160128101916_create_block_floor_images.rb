class CreateBlockFloorImages < ActiveRecord::Migration
  def change
    create_table :block_floor_images do |t|
    	t.integer :block_floor_id
    	t.integer :order
    	t.string :description
    end

    add_attachment :block_floor_images, :image
  end
end
