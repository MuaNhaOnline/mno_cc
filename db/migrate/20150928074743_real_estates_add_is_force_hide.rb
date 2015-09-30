class RealEstatesAddIsForceHide < ActiveRecord::Migration
  def change
  	add_column :real_estates, :is_force_hide, :boolean, default: false
  end
end
