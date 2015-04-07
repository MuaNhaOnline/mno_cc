class DisadvantagesRealEstates < ActiveRecord::Migration
  def change
    create_table :disadvantages_real_estates do |t|
      t.integer :real_estate_id
      t.integer :disadvantage_id

      t.timestamps null: false
    end
  end
end
