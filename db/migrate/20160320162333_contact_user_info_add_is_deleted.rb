class ContactUserInfoAddIsDeleted < ActiveRecord::Migration
  def change
  	add_column :contact_user_infos, :is_deleted, :boolean, default: false
  end
end
