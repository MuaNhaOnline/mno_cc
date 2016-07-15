class SystemMailReceiversAddIsRead < ActiveRecord::Migration
  def change
  	add_column :system_mail_receivers, :is_read, :boolean, default: false
  end
end
