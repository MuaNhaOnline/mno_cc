class CreateInvestors < ActiveRecord::Migration
  def change
    create_table :investors do |t|
      t.text :name
      t.text :options

      t.timestamps null: false
    end
  end
end
