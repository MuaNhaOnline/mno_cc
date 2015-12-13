class SessionRemoveUserInfoId < ActiveRecord::Migration
  def change
  	remove_column :sessions, :user_info_id
  end
end
