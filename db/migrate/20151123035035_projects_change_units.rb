class ProjectsChangeUnits < ActiveRecord::Migration
  def change
  	remove_column :projects, :execute_unit
  	remove_column :projects, :design_unit
  	remove_column :projects, :manage_unit
  	add_column :projects, :unit_description, :text
  end
end
