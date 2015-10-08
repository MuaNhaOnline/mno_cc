class ProjectsChangeUsingRatioToFloat < ActiveRecord::Migration
  def change
  	change_column :projects, :using_ratio, :decimal
  end
end
