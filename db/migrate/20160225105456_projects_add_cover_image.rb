class ProjectsAddCoverImage < ActiveRecord::Migration
  def change
  	add_attachment :projects, :cover_image
  end
end
