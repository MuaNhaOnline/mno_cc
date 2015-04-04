class RenameReferenceColumnOfWard < ActiveRecord::Migration
  def change
    rename_column :wards, :district_id, :province_id
  end
end
