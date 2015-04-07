class AdvantagesRealEstates < ActiveRecord::Migration
  def change
    create_table :advantages_real_estates do |t|
      t.integer :real_estate_id
      t.integer :advantage_id

      t.timestamps null: false
    end
  end
end
