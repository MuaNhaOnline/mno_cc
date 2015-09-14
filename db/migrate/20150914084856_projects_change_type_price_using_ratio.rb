class ProjectsChangeTypePriceUsingRatio < ActiveRecord::Migration
  def change
  	change_column :projects, :using_ratio, :integer
  end
end
