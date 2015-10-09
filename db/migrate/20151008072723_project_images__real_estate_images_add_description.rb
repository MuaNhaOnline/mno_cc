class ProjectImagesRealEstateImagesAddDescription < ActiveRecord::Migration
  def change
  	add_column :project_images, :description, :text
  	add_column :real_estate_images, :description, :text
  end
end
