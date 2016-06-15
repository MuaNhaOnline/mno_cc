class UsersAddIsReceiveEmail < ActiveRecord::Migration
  def change
  	add_column :users, :is_receive_email, :boolean, default: false
  end
end
