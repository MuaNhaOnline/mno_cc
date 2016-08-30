class CreateBlogsRealEstates < ActiveRecord::Migration
  def change
    create_table :blogs_real_estates do |t|
    	t.integer :blog_id
    	t.integer :real_estate_id
    end
  end
end
