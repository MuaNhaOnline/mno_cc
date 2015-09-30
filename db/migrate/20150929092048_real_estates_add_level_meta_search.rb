class RealEstatesAddLevelMetaSearch < ActiveRecord::Migration
  def change
  	rename_column :real_estates, :meta_search, :meta_search_1
  	add_column :real_estates, :meta_search_2, :text
  	add_column :real_estates, :meta_search_3, :text
  end
end
