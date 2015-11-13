class CreateProjectImageDescriptions < ActiveRecord::Migration
  def change
    create_table :project_image_descriptions do |t|
    	t.integer :project_image_id
    	t.text :area_type
    	t.text :area_info
    	t.text :description_type
    end
  end
end
