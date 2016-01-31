class CreateProjectRegionUtilities < ActiveRecord::Migration
  def change
    create_table :project_region_utilities do |t|
	    t.integer :project_id
	    t.string :title
	    t.text :description
	    t.string :icon_key
	    t.string :icon_color
    end
  end
end
