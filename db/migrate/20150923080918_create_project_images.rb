class CreateProjectImages < ActiveRecord::Migration
  def change
    create_table :project_images do |t|
    	t.integer :project_id
    	t.boolean :is_avatar, default: false
    end
    
    add_attachment :project_images, :image
  end
end
