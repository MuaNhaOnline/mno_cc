class ProjectsAddLogo < ActiveRecord::Migration
  def change
    add_attachment :projects, :logo
  end
end
