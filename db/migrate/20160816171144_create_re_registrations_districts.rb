class CreateReRegistrationsDistricts < ActiveRecord::Migration
  def change
    create_table :re_registrations_districts do |t|
    	t.integer :re_registration_id
    	t.integer :district_id
    end
  end
end
