class ProjectsAddMainColor < ActiveRecord::Migration
  def change
  	add_column :projects, :main_color, :string
  end
end
