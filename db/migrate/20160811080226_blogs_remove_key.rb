class BlogsRemoveKey < ActiveRecord::Migration
  def change
  	remove_column :blogs, :key
  end
end
