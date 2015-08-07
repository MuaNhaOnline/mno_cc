class AddColumnLatLongIntoProjects < ActiveRecord::Migration
  def change
  	add_column :projects, :lat, :text
  	add_column :projects, :long, :text
  end
end
