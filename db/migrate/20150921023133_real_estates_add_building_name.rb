class RealEstatesAddBuildingName < ActiveRecord::Migration
  def change
  	add_column :real_estates, :building_name, :text
  end
end
