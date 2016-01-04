class CreateProjectLogs < ActiveRecord::Migration
  def change
    create_table :project_logs do |t|
    	t.integer :project_id
    	t.string :user_type
    	t.integer :user_id
    	t.string :action

      	t.timestamps null: false
    end
  end
end
