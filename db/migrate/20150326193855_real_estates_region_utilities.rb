class RealEstatesRegionUtilities < ActiveRecord::Migration
  def change
    create_table :real_estates_region_utilities do |t|
      t.integer :real_estate_id
      t.integer :region_utility_id

      t.timestamps null: false
    end
  end
end