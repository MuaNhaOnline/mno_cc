class ImagesAddOrder < ActiveRecord::Migration
  def change
  	add_column :real_estate_images, :order, :integer
  	add_column :project_images, :order, :integer
  	add_column :block_images, :order, :integer
  end
end
