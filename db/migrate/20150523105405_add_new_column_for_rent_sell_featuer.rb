class AddNewColumnForRentSellFeatuer < ActiveRecord::Migration
  def change
  	rename_column :real_estates, :price, :rent_price
  	rename_column :real_estates, :unit_id, :rent_unit_id
  	add_column :real_estates, :sell_price, :decimal
  	add_column :real_estates, :sell_unit_id, :integer
  end
end
