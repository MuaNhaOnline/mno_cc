class CreateProjectUtilities < ActiveRecord::Migration
  def change
    create_table :project_utilities do |t|
    	t.integer :project_id
    	t.string :title
    	t.text :description
    end
  end
end
