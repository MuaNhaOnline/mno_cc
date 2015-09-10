class UserRemoveColumnRemoteIp < ActiveRecord::Migration
  def change
  	remove_column :users, :remote_ip
  end
end