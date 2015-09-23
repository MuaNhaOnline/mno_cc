class CreateTemporaryFile < ActiveRecord::Migration
  def change
    create_table :temporary_files do |t|
    	t.text :name
    end
  end
end
