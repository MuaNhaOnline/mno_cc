class CreateReRegistrations < ActiveRecord::Migration
  def change
    create_table :re_registrations do |t|
    	t.belongs_to :purpose
    	t.decimal :min_price
    	t.decimal :max_price
    	t.decimal :min_area
    	t.decimal :max_area
  	  t.datetime :created_at
    end
  end
end
