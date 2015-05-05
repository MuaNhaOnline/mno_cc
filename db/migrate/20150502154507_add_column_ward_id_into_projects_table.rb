class AddColumnWardIdIntoProjectsTable < ActiveRecord::Migration
  def change
      add_column :projects, :ward_id, :integer
  end
end
