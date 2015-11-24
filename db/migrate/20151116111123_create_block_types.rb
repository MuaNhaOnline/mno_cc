class CreateBlockTypes < ActiveRecord::Migration
  def change
    create_table :block_types do |t|
	    t.text :name
	    t.text :code
	    t.text :options
	    t.integer :order
    end
  end
end
