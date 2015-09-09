class UsersAddRemoteIp < ActiveRecord::Migration
  def change
  	add_column :users, :remote_ip, :text
  end
end
