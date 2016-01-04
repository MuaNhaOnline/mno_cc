class UsersRecreateSessionId < ActiveRecord::Migration
  def change
  	remove_column :users, :session_id
  	add_column :users, :session_id, :string
  end
end
