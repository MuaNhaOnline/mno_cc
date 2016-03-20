class RealEstatesRemoveUserInfos < ActiveRecord::Migration
  def change
  	remove_column :real_estates, :user_full_name
  	remove_column :real_estates, :user_email
  	remove_column :real_estates, :user_phone_number
  end
end
