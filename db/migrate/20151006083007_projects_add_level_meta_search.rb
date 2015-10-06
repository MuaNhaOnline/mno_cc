class ProjectsAddLevelMetaSearch < ActiveRecord::Migration
  def change
  	rename_column :projects, :meta_search, :meta_search_1
  	add_column :projects, :meta_search_2, :text
  	add_column :projects, :meta_search_3, :text
  end
end
