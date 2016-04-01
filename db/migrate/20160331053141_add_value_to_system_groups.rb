class AddValueToSystemGroups < ActiveRecord::Migration
  def change
    add_column :system_groups, :value, :string
  end
end
