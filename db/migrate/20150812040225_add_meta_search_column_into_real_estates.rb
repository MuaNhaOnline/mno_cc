class AddMetaSearchColumnIntoRealEstates < ActiveRecord::Migration
  def change
  	add_column :real_estates, :meta_search, :text
  end
end
