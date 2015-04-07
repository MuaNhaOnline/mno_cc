class CreateStreetTypes < ActiveRecord::Migration
  def change
    create_table :street_types do |t|
      t.text :name
      t.text :code
      t.text :options
      t.integer :index

      t.timestamps null: false
    end
  end
end
