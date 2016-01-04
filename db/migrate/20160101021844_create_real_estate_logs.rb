class CreateRealEstateLogs < ActiveRecord::Migration
  def change
    create_table :real_estate_logs do |t|
    	t.integer :real_estate_id
    	t.string :user_type
    	t.integer :user_id
    	t.string :action

      	t.timestamps null: false
    end
  end
end
