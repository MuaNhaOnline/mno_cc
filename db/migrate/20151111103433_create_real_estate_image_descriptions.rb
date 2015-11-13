class CreateRealEstateImageDescriptions < ActiveRecord::Migration
  def change
    create_table :real_estate_image_descriptions do |t|
    	t.integer :real_estate_image_id
    	t.text :area_type
    	t.text :area_info
    	t.text :description_type
    end
  end
end
