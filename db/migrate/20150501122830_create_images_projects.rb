class CreateImagesProjects < ActiveRecord::Migration
  def change
    create_table :images_projects do |t|
      t.integer :project_id
      t.integer :image_id

      t.timestamps null: false
    end
  end
end
