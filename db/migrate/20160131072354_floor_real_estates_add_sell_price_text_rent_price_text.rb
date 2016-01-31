class FloorRealEstatesAddSellPriceTextRentPriceText < ActiveRecord::Migration
  def change
  	add_column :floor_real_estates, :sell_price_text, :string
  	add_column :floor_real_estates, :rent_price_text, :string
  end
end
