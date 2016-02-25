class ProjectsAddCreateStep < ActiveRecord::Migration
  def change
  	add_column :projects, :create_step, :integer, default: 0
  end
end
