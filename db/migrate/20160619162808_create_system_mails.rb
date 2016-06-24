class CreateSystemMails < ActiveRecord::Migration
  def change
    create_table :system_mails do |t|
  	  t.integer 	:sender_id
  	  t.text 		:subject
  	  t.text 		:content
  	  t.integer 	:system_mail_type
  	  t.integer 	:reply_id
  	  t.boolean 	:is_sender_deleted, 	default: false

      t.datetime 	:created_at
    end
  end
end
