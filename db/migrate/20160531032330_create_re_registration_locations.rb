class CreateReRegistrationLocations < ActiveRecord::Migration
  def change
    create_table :re_registration_locations do |t|
    	t.belongs_to :re_registration
    	t.string :object_type
    	t.integer :object_id
    	t.index :object_id
    end
  end
end
