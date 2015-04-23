class InsertIsPendingIntoRealEstates < ActiveRecord::Migration
  def change
    add_column :real_estates, :is_pending, :integer
  end
end
