class AddTypeIntoImages < ActiveRecord::Migration
  def change
    add_column :images, :type, :text
  end
end
