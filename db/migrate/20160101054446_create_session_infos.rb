class CreateSessionInfos < ActiveRecord::Migration
  def change
    create_table :session_infos do |t|
    	t.string :utm_campaign
    	t.string :utm_term
    	t.string :utm_content
    	t.string :utm_source
    	t.string :utm_medium
    	t.integer :begin_session_info_id
    	t.string :leave_infos
    	t.string :signed_users

        t.timestamps null: false
    end
  end
end
