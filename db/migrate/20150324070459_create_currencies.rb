class CreateCurrencies < ActiveRecord::Migration
  def change
    create_table :currencies do |t|
      t.text :name
      t.text :code
      t.text :options
      t.integer :index

      t.timestamps null: false
    end
  end
end
