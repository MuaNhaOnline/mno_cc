class WardsStreetsAddDistrictId < ActiveRecord::Migration
  def change
  	add_column :wards, :district_id, :integer
  	add_column :streets, :district_id, :integer
  end
end
