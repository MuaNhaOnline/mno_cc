class AddUserIdIntoProjects < ActiveRecord::Migration
  def change
		add_column :projects, :user_id, :integer
		add_column :projects, :meta_search, :text
  end
end
