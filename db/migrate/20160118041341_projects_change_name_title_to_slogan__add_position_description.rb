class ProjectsChangeNameTitleToSloganAddPositionDescription < ActiveRecord::Migration
  def change
  	rename_column :projects, :title, :slogan
  	add_column :projects, :position_description, :text
  end
end
