class RealEstateOwnersAddAddress < ActiveRecord::Migration
  def change
  	add_column :real_estate_owners, :address, :string
  end
end
