class RemoveUselessTables < ActiveRecord::Migration
  def change
  	drop_table :images_projects
  	drop_table :images_real_estates
  	drop_table :status_logs
  end
end
