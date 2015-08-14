class AddUserTypesColumn < ActiveRecord::Migration
  def change
  	add_column :users, :is_system_manager, :boolean, default: false
  	add_column :users, :is_real_estate_manager, :boolean, default: false
  end
end
