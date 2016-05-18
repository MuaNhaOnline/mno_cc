class UsersAddCreatedAt < ActiveRecord::Migration
  def change
  	add_column :users, :created_at, :datetime
  end
end
