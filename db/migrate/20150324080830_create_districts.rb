class CreateDistricts < ActiveRecord::Migration
  def change
    create_table :districts do |t|
      t.text :name
      t.text :code
      t.integer :province_id

      t.timestamps null: false
    end
  end
end
