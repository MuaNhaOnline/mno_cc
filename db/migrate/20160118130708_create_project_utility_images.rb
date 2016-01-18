class CreateProjectUtilityImages < ActiveRecord::Migration
  def change
    create_table :project_utility_images do |t|
    	t.integer :project_utility_id
    	t.string :description
    	t.integer :order
    end

    add_attachment :project_utility_images, :image
  end
end
