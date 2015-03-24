class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.text :path
      t.text :options

      t.timestamps null: false
    end
  end
end
