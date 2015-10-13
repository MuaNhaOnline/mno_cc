class UsersAddRealEstateCountProjectCount < ActiveRecord::Migration
  def change
  	add_column :users, :real_estate_count, :integer, default: 0
  	add_column :users, :project_count, :integer, default: 0
  end
end
