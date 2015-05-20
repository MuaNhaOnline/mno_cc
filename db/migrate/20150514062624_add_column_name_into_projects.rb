class AddColumnNameIntoProjects < ActiveRecord::Migration
  def change
  	add_column :projects, :name, :text
  end
end
