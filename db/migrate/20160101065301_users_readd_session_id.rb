class UsersReaddSessionId < ActiveRecord::Migration
  def change
  	remove_column :users, :session_id, :string
  	add_column :users, :session_info_id, :integer
  end
end
