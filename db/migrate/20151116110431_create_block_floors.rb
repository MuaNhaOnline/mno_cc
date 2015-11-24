class CreateBlockFloors < ActiveRecord::Migration
  def change
    create_table :block_floors do |t|
    	t.integer :block_id
    	t.text :name
    	t.text :description
    	t.text :floors
    	t.text :floors_text
    end

    add_attachment :block_floors, :surface
  end
end
