class CreateRequestedSystemMails < ActiveRecord::Migration
  def change
    create_table :requested_system_mails do |t|
    	t.integer 	:system_mail_id
    	t.integer 	:requested_type
    	t.string 	:object_type
    	t.integer 	:object_id
    	t.integer 	:status, 			default: 1
    	t.text 		:note
    end
  end
end
