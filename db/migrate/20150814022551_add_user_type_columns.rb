class AddUserTypeColumns < ActiveRecord::Migration
  def change
  	add_column :users, :is_project_manager, :boolean, default: false
  	add_column :users, :is_user_manager, :boolean, default: false
  	add_column :users, :is_appraiser, :boolean, default: false
  	add_column :users, :is_statistician, :boolean, default: false
  end
end
