class CreatePlanningStatusTypes < ActiveRecord::Migration
  def change
    create_table :planning_status_types do |t|
      t.text :name
      t.text :code
      t.text :options

      t.timestamps null: false
    end
  end
end
