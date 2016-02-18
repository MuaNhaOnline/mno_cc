class CreateRealEstateOwners < ActiveRecord::Migration
  def change
    create_table :real_estate_owners do |t|
	  t.integer :real_estate_id
	  t.string :name
	  t.string :email
	  t.string :phone
    end
  end
end
