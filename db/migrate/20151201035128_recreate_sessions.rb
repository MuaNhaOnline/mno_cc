class RecreateSessions < ActiveRecord::Migration
  def change
  	drop_table :sessions

    create_table :sessions do |t|
  		t.text :utm_campaign
  		t.text :utm_source
  		t.text :utm_medium
  		t.text :utm_term
  		t.text :utm_content
  		t.text :referrer_host
  		t.text :referrer_source
  		t.integer :begin_session_id

      t.timestamps null: false
    end
  end
end
