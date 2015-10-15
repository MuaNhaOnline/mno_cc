class CreateUsersFavoriteProjects < ActiveRecord::Migration
  def change
    create_table :users_favorite_projects do |t|
    	t.integer :user_id
    	t.integer :project_id
    	t.datetime :created_at
    end
  end
end
