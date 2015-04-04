class RenameReferenceColumnOfStreet < ActiveRecord::Migration
  def change
    rename_column :streets, :ward_id, :province_id
  end
end
