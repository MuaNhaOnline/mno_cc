class RealEstatesChangeIsFull < ActiveRecord::Migration
  def change
  	change_column_default :real_estates, :is_full, true
  end
end
