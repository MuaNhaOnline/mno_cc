class CreateTranslates < ActiveRecord::Migration
  def change
    create_table :translate_keys, id: false do |t|
	    t.integer :object_type
	    t.string :key
    end

    create_table :translate_values, id: false do |t|
      t.integer :object_type
      t.string :key
	    t.string :text
	    t.string :language
    end
  end
end
