class RealEstatesAddIsFavorite < ActiveRecord::Migration
  def change
  	add_column :real_estates, :is_favorite, :boolean, default: false
  end
end
