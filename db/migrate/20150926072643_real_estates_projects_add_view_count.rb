class RealEstatesProjectsAddViewCount < ActiveRecord::Migration
  def change
  	add_column :real_estates, :view_count, :integer, default: 0
  	add_column :projects, :view_count, :integer, default: 0
  end
end
