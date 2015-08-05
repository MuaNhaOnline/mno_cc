class AddLatLongColumnIntoRealEstate < ActiveRecord::Migration
  def change
  	add_column :real_estates, :lat, :text
  	add_column :real_estates, :long, :text
  end
end
