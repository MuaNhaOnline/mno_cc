class UpdateImagesTable < ActiveRecord::Migration
  def change
    rename_column :images, :path, :folder
  end
end