class CreateReRegistrationsProvinces < ActiveRecord::Migration
  def change
    create_table :re_registrations_provinces do |t|
    	t.integer :re_registration_id
    	t.integer :province_id
    end
  end
end
