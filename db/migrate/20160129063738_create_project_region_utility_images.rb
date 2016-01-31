class CreateProjectRegionUtilityImages < ActiveRecord::Migration
  def change
    create_table :project_region_utility_images do |t|
    	t.integer :project_region_utility_id
    	t.string :description
    	t.integer :order
    end

    add_attachment :project_region_utility_images, :image
  end
end
