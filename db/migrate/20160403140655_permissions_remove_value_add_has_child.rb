class PermissionsRemoveValueAddHasChild < ActiveRecord::Migration
  def change
  	remove_column :permissions, :value
  	add_column :permissions, :has_child, :boolean, default: false
  end
end
