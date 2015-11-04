class RealEstatesAddExtraColumnForBlock < ActiveRecord::Migration
  def change
  	add_column :real_estates, :label, :text
  	add_column :real_estates, :floor_coefficient, :decimal
  	add_column :real_estates, :floors_text, :text
  	add_column :real_estates, :floors, :text
  	add_column :real_estates, :garden_area, :text
  end
end
