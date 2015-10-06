class ProjectsAddIsFavoriteIsForceHide < ActiveRecord::Migration
  def change
  	add_column :projects, :is_favorite, :boolean, default: false
  	add_column :projects, :is_force_hide, :boolean, default: false
  end
end
