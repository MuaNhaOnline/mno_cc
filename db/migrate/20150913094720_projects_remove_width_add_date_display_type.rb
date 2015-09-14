class ProjectsRemoveWidthAddDateDisplayType < ActiveRecord::Migration
  def change
  	remove_column :projects, :width_x
  	remove_column :projects, :width_y
  	add_column :projects, :date_display_type, :datetime
  end
end
