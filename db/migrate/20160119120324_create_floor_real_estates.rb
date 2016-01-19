class CreateFloorRealEstates < ActiveRecord::Migration
  def change
    create_table :floor_real_estates do |t|
    	t.string :label
    	t.integer :real_estate_id
    	t.integer :floor
    	t.decimal :sell_price
    	t.decimal :rent_price
    	t.string :status
    end
  end
end
