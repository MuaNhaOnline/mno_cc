class CreateRelativeUsers < ActiveRecord::Migration
  def change
    create_table :relative_users do |t|
    	t.string :user_type
    	t.integer :user_id
    	t.string :object_type
    	t.integer :object_id
    end
  end
end
