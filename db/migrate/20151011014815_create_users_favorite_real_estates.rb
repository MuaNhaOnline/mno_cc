class CreateUsersFavoriteRealEstates < ActiveRecord::Migration
  def change
    create_table :users_favorite_real_estates do |t|
    	t.integer :user_id
    	t.integer :real_estate_id
    	t.datetime :created_at
    end
  end
end
