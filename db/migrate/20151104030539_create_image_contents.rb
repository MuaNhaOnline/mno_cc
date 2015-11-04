class CreateImageContents < ActiveRecord::Migration
  def change
    create_table :image_contents do |t|
    end
    add_attachment :image_contents, :image
  end
end
