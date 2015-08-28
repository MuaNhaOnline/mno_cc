class AddActiveAccountColumns < ActiveRecord::Migration
  def change
  	add_column :users, :active_status, :integer
  	add_column :users, :params, :text
  end
end
