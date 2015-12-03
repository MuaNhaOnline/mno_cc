class SessionsAddReferrerHostName < ActiveRecord::Migration
  def change
  	add_column :sessions, :referrer_host_name, :text
  end
end
