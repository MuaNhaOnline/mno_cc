class AddSenderTypeToSystemMails < ActiveRecord::Migration
  def change
    add_column :system_mails, :sender_type, :string, default: 'user'
  end
end
