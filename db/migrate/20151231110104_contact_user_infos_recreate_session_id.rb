class ContactUserInfosRecreateSessionId < ActiveRecord::Migration
  def change
  	remove_column :contact_user_infos, :session_id
  	add_column :contact_user_infos, :session_id, :string
  end
end
