class CreateBlogs < ActiveRecord::Migration
  def change
    create_table :blogs do |t|
    	t.text :title
    	t.text :content
    	t.integer :order

      t.timestamps null: false
    end
  end
end
