class CreateSystemMailReceivers < ActiveRecord::Migration
  def change
    create_table :system_mail_receivers do |t|
    	t.integer 	:system_mail_id
    	t.integer 	:receiver_id
    	t.string 	:receiver_type,			default: 'user'
    	t.boolean 	:is_receiver_deleted, 	default: false
    end
  end
end
