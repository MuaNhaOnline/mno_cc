class ProjectsAddFullLogo < ActiveRecord::Migration
  def change
    add_attachment :projects, :full_logo
  end
end
