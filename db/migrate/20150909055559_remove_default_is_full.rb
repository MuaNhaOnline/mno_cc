class RemoveDefaultIsFull < ActiveRecord::Migration
  def change
  	change_column_default :real_estates, :is_full, nil
  end
end
