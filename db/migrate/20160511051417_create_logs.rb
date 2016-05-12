class CreateLogs < ActiveRecord::Migration
  def change
    create_table :logs do |t|
    	t.string :object_type
    	t.integer :object_id
    	t.string :user_type
    	t.integer :user_id
      	t.string :action
      	t.datetime :created_at
    end
  end
end
