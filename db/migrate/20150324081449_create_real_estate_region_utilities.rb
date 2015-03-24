class CreateRealEstateRegionUtilities < ActiveRecord::Migration
  def change
    create_table :real_estate_region_utilities do |t|
      t.integer :real_estate_id
      t.integer :region_utility_id

      t.timestamps null: false
    end
  end
end
