class CreateRealEstateDisadvantages < ActiveRecord::Migration
  def change
    create_table :real_estate_disadvantages do |t|
      t.integer :real_estate_id
      t.integer :disadvantage_id

      t.timestamps null: false
    end
  end
end
