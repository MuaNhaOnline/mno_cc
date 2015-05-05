class CreateProjectTypes < ActiveRecord::Migration
  def change
    create_table :project_types do |t|
      t.text :name
      t.text :code
      t.text :options
      t.integer :order

      t.timestamps null: false
    end
  end
end
