class SystemGroupChangeIsLocked < ActiveRecord::Migration
  def change
  	change_column_default :system_groups, :is_locked, false
  end
end
