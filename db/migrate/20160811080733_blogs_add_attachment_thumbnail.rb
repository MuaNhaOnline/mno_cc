class BlogsAddAttachmentThumbnail < ActiveRecord::Migration
  def change
    add_attachment :blogs, :thumbnail
  end
end
