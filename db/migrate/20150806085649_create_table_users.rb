class CreateTableUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.text :account
      t.text :password
      t.text :email
      t.text :full_name
      t.date :birthday
      t.text :business_name
      t.text :phone_number
      t.text :address
      t.integer :avatar_image_id
    end
  end
end
