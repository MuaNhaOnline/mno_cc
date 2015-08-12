class ChangeStreetType < ActiveRecord::Migration
  def change
  	drop_table :street_types
  	rename_column :real_estates, :street_type_id, :street_type
  end
end
