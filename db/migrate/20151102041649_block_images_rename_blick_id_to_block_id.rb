class BlockImagesRenameBlickIdToBlockId < ActiveRecord::Migration
  def change
  	rename_column :block_images, :blick_id, :block_id
  end
end
