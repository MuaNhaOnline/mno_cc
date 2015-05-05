class AddStatusLogTable < ActiveRecord::Migration
  def change
    create_table :status_logs do |t|
      t.integer :user_id
      t.text :code

      t.timestamps null: false
    end
  end
end
