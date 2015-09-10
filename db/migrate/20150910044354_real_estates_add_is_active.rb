class RealEstatesAddIsActive < ActiveRecord::Migration
  def change
  	add_column :real_estates, :is_active, :boolean, default: true
  end
end
