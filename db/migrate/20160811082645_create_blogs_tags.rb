class CreateBlogsTags < ActiveRecord::Migration
  def change
    create_table :blogs_tags do |t|
    	t.integer :blog_id
    	t.integer :tag_id
    end
  end
end
