class CreateProjectImageBlockDescriptions < ActiveRecord::Migration
  def change
    create_table :project_image_block_descriptions do |t|
    	t.integer :project_image_description_id
    	t.integer :block_id
    end
  end
end
