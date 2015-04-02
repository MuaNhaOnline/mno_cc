class AddNameIntoImages < ActiveRecord::Migration
  def change
    add_column :images, :name, :text
  end
end
