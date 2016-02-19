class UsersRenameZohoChangedFieldsToZohoIsChanged < ActiveRecord::Migration
  def change
  	rename_column :users, :zoho_lead_id, :zoho_id
  	remove_column :users, :zoho_changed_fields
  	add_column :users, :zoho_is_changed, :boolean, default: false
  end
end
