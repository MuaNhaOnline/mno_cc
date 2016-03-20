class RealEstatesAddUserType < ActiveRecord::Migration
  def change
  	add_column :real_estates, :user_type, :string, default: 'user'
  end
end
