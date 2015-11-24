class CreateProjectImageImageDescriptions < ActiveRecord::Migration
  def change
    create_table :project_image_image_descriptions do |t|
    	t.integer :project_image_description_id
	    t.boolean 'is_avatar', default: false
	    t.text 'description'
	    t.integer 'order'
    end

    add_attachment :project_image_image_descriptions, :image
  end
end
