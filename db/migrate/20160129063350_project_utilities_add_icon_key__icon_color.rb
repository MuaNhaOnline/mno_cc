class ProjectUtilitiesAddIconKeyIconColor < ActiveRecord::Migration
  def change
  	add_column :project_utilities, :icon_key, :string
  	add_column :project_utilities, :icon_color, :string
  end
end
