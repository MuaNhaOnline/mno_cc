class CreateRealEstateImages < ActiveRecord::Migration
  def change
    create_table :real_estate_images do |t|
      t.integer :real_estate_id
      t.integer :image_id

      t.timestamps null: false
    end
  end
end
