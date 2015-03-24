class CreateRealEstateRealEstateUtilities < ActiveRecord::Migration
  def change
    create_table :real_estate_real_estate_utilities do |t|
      t.integer :real_estate_id
      t.integer :real_estate_utility_id

      t.timestamps null: false
    end
  end
end
