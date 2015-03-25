class CreateRealEstateAdvantages < ActiveRecord::Migration
  def change
    create_table :real_estate_advantages do |t|
      t.integer :real_estate_id
      t.integer :advantage_id

      t.timestamps null: false
    end
  end
end
