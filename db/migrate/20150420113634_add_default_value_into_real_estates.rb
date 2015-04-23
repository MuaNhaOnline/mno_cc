class AddDefaultValueIntoRealEstates < ActiveRecord::Migration
  def change
    change_column_default :real_estates, :is_show, 1
    change_column_default :real_estates, :is_paid, 1
    change_column_default :real_estates, :is_pending, 1
  end
end
