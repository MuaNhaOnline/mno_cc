class PropertyUtilitiesRealEstates < ActiveRecord::Migration
  def change
    create_table :property_utilities_real_estates do |t|
      t.integer :real_estate_id
      t.integer :property_utility_id

      t.timestamps null: false
    end
  end
end
