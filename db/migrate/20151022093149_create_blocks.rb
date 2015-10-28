class CreateBlocks < ActiveRecord::Migration
  def change
    create_table :blocks do |t|
  		t.integer :project_id
    	t.text :name
    	t.text :description
    end
  end
end
