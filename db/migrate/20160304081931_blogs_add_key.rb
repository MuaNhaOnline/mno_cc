class BlogsAddKey < ActiveRecord::Migration
  def change
  	add_column :blogs, :key, :string
  end
end
