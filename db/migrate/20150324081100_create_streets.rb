class CreateStreets < ActiveRecord::Migration
  def change
    create_table :streets do |t|
      t.text :name
      t.text :code
      t.integer :ward_id

      t.timestamps null: false
    end
  end
end
