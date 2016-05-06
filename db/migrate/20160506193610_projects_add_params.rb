class ProjectsAddParams < ActiveRecord::Migration
  def change
	add_column :projects, :params, :text
  end
end
