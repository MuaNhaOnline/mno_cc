class SystemMailsChangeSystemMailType < ActiveRecord::Migration
  def change
  	change_column :system_mails, :system_mail_type, :integer, default: 1
  end
end
