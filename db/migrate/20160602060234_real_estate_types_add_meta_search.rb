class RealEstateTypesAddMetaSearch < ActiveRecord::Migration
  def change
  	add_column :real_estate_types, :meta_search, :text
  end
end
