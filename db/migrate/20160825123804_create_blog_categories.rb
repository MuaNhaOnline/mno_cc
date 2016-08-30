class CreateBlogCategories < ActiveRecord::Migration
  def change
    create_table :blog_categories do |t|
    	t.string :name
    end
  end
end
