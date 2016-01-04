class CreateContactRequests < ActiveRecord::Migration
	def change
		create_table :contact_requests do |t|
			t.integer :user_id
			t.string :user_type
			t.integer :status
			t.text :note
			t.text :message
			t.string :object_type
			t.integer :object_id

			t.timestamps null: false
		end
	end
end
