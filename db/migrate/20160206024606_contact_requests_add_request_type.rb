class ContactRequestsAddRequestType < ActiveRecord::Migration
  def change
  	add_column :contact_requests, :request_type, :string
  end
end
