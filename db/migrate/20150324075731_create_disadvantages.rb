class CreateDisadvantages < ActiveRecord::Migration
  def change
    create_table :disadvantages do |t|
      t.text :name
      t.text :code
      t.text :options

      t.timestamps null: false
    end
  end
end
