class RealEstatesProjectsChangeLatLong < ActiveRecord::Migration
  def change
  	remove_column :real_estates, :lat, :string
  	add_column :real_estates, :lat, :float, precision: 10, scale: 6
  	remove_column :real_estates, :long, :string
  	add_column :real_estates, :lng, :float, precision: 10, scale: 6

  	remove_column :projects, :lat, :string
  	add_column :projects, :lat, :float, precision: 10, scale: 6
  	remove_column :projects, :long, :string
  	add_column :projects, :lng, :float, precision: 10, scale: 6
  end
end
