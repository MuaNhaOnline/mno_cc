class ProjectsChangeSomeType < ActiveRecord::Migration
  def change
  	remove_column :projects, :is_show
		add_column :projects, :is_show, :boolean, default: true
  	remove_column :projects, :is_pending
		add_column :projects, :is_pending, :boolean, default: true
  	remove_column :projects, :is_draft
		add_column :projects, :is_draft, :boolean, default: true
  	remove_column :projects, :date_display_type
		add_column :projects, :date_display_type, :integer
    change_column :projects, :using_ratio, :integer
  end
end
