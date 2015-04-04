class DropCreateModifyAtColumns < ActiveRecord::Migration
  def change
    remove_column :provinces, :created_at
    remove_column :provinces, :updated_at
    remove_column :districts, :created_at
    remove_column :districts, :updated_at
    remove_column :wards, :created_at
    remove_column :wards, :updated_at
    remove_column :streets, :created_at
    remove_column :streets, :updated_at
  end
end
