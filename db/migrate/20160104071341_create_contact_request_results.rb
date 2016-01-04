class CreateContactRequestResults < ActiveRecord::Migration
  def change
    create_table :contact_request_results do |t|
    	t.integer :contact_request_id
    	t.string :content
    	t.integer :rate
    	t.string :comment

      	t.timestamps null: false
    end
  end
end
