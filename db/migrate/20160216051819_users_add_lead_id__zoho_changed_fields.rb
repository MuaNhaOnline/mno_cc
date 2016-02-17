class UsersAddLeadIdZohoChangedFields < ActiveRecord::Migration
  def change
  	add_column :users, :zoho_lead_id, :string
  	add_column :users, :zoho_changed_fields, :string
  end
end
