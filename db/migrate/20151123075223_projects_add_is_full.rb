class ProjectsAddIsFull < ActiveRecord::Migration
  def change
  	add_column :projects, :is_full, :boolean, default: false
  end
end
