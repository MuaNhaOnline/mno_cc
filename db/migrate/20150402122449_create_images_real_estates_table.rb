class CreateImagesRealEstatesTable < ActiveRecord::Migration
  def change
    create_table :images_real_estates do |t|
      t.integer :real_estate_id
      t.integer :image_id

      t.timestamps null: false
    end
  end
end
