class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
    	t.string :user_type
    	t.integer :user_id
    	t.string :object_type
    	t.integer :object_id
    	t.string :action
    	t.text :data
    	t.datetime :created_at
    end
  end
end
