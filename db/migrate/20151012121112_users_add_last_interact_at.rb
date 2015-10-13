class UsersAddLastInteractAt < ActiveRecord::Migration
  def change
  	add_column :users, :last_interact_at, :datetime
  end
end