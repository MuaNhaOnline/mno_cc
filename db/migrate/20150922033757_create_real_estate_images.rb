class CreateRealEstateImages < ActiveRecord::Migration
  def change
    create_table :real_estate_images do |t|
    	t.integer :real_estate_id
    	t.boolean :is_avatar, default: false
    end

    add_attachment :real_estate_images, :image
  end
end
