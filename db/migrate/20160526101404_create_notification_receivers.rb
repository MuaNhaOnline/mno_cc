class CreateNotificationReceivers < ActiveRecord::Migration
  def change
    create_table :notification_receivers do |t|
    	t.integer :notification_id
    	t.integer :user_id
    	t.boolean :is_read, default: false
    end
  end
end
