class SessionsAddUserInfo < ActiveRecord::Migration
  def change
  	add_column :sessions, :user_info_type, :text
  	add_column :sessions, :user_info_id, :integer
  end
end
