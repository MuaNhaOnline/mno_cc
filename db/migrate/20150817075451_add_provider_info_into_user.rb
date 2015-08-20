class AddProviderInfoIntoUser < ActiveRecord::Migration
  def change
  	add_column :users, :provider, :text
  	add_column :users, :provider_user_id, :text
  	add_column :users, :provider_token, :text
  	add_column :users, :provider_expires_at, :datetime
  end
end
