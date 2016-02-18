class RealEstatesAddOwnerInfo < ActiveRecord::Migration
  def change
  	add_column :real_estates, :owner_type, :string
  end
end
