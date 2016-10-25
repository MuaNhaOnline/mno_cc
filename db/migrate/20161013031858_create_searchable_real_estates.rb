class CreateSearchableRealEstates < ActiveRecord::Migration
  def change
    create_table :searchable_real_estates, id: false do |t|
    	t.integer :real_estate_id
    	t.string :real_estate_display_id
    	t.string :address
    	t.string :real_estate_type
    	t.string :title
    	t.text :description
    end
  end
end
