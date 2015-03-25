class CreateWards < ActiveRecord::Migration
  def change
    create_table :wards do |t|
      t.text :name
      t.text :code
      t.integer :district_id

      t.timestamps null: false
    end
  end
end
