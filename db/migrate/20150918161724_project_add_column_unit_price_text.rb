class ProjectAddColumnUnitPriceText < ActiveRecord::Migration
  def change
  	add_column :projects, :unit_price_text, :text
  end
end
