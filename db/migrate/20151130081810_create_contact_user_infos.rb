class CreateContactUserInfos < ActiveRecord::Migration
  def change
    create_table :contact_user_infos do |t|
    	t.integer :session_id
    	t.text :name
    	t.text :phone_number
    	t.text :email

      t.timestamps
    end
  end
end
