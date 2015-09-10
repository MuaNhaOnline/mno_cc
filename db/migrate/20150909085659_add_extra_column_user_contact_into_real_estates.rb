class AddExtraColumnUserContactIntoRealEstates < ActiveRecord::Migration
  def change
  	add_column :real_estates, :user_full_name, :text
  	add_column :real_estates, :user_email, :text
  	add_column :real_estates, :user_phone_number, :text
  end
end
