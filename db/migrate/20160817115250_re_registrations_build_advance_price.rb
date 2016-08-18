class ReRegistrationsBuildAdvancePrice < ActiveRecord::Migration
  def change
  	rename_column :re_registrations, :min_price, :min_sell_price
  	rename_column :re_registrations, :max_price, :max_sell_price

  	add_column :re_registrations, :min_rent_price, :decimal
  	add_column :re_registrations, :max_rent_price, :decimal
  end
end
