class RenameRealEstatesImagesTable < ActiveRecord::Migration
  def change
    rename_table :real_estate_images, :images_real_estates
  end
end
