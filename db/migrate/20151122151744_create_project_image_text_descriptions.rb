class CreateProjectImageTextDescriptions < ActiveRecord::Migration
  def change
    create_table :project_image_text_descriptions do |t|
    	t.integer :project_image_description_id
    	t.text :description
    end
  end
end
