class CreateTranslates < ActiveRecord::Migration
  def change
    create_table :translates, id: false do |t|
	  t.string :object_type
	  t.string :key
	  t.string :text
	  t.string :language
    end
  end
end
