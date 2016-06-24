class RequestedSystemMailsAddUpdatedAt < ActiveRecord::Migration
  def change
  	add_column :requested_system_mails, :updated_at, :datetime
  end
end
