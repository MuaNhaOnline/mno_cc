class ProjectsAddProjectName < ActiveRecord::Migration
  def change
  	add_column :projects, :project_name, :text
  end
end
