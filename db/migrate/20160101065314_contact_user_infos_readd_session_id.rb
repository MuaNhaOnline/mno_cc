class ContactUserInfosReaddSessionId < ActiveRecord::Migration
  def change
  	remove_column :contact_user_infos, :session_id, :string
  	add_column :contact_user_infos, :session_info_id, :integer
  end
end
