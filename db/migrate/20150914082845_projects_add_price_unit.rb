class ProjectsAddPriceUnit < ActiveRecord::Migration
  def change
  	add_column :projects, :price_unit_id, :integer
  end
end
