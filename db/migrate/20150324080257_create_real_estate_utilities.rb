class CreateRealEstateUtilities < ActiveRecord::Migration
  def change
    create_table :real_estate_utilities do |t|
      t.text :name
      t.text :code
      t.text :options

      t.timestamps null: false
    end
  end
end
