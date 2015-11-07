class CreateRealEstateFloorInfos < ActiveRecord::Migration
  def change
    create_table :real_estate_floor_infos do |t|
      t.text :label
    	t.integer :real_estate_id
    	t.integer :floor
    	t.decimal :sell_price
    	t.decimal :rent_price
    end

    remove_column :real_estates, :garden_area, :text
    add_column :real_estates, :garden_area, :decimal
    remove_column :real_estates, :floors, :text
    remove_column :real_estates, :floor_coefficient, :text
    rename_column :real_estates, :floors_text, :floor_infos_text
    add_column :real_estates, :block_id, :integer
  end
end
