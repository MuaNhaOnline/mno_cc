class AddExtraColumnIntoRealEstates < ActiveRecord::Migration
  def change
  	add_column :real_estates, :is_full, :boolean, default: true
  	add_column :real_estates, :sell_price_text, :text
  	add_column :real_estates, :rent_price_text, :text
  end
end
