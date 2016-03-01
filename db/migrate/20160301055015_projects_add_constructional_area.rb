class ProjectsAddConstructionalArea < ActiveRecord::Migration
  def change
  	add_column :projects, :constructional_area, :decimal
  end
end
