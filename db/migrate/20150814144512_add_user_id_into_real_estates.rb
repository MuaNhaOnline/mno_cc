class AddUserIdIntoRealEstates < ActiveRecord::Migration
  def change
		add_column :real_estates, :user_id, :integer
  end
end
