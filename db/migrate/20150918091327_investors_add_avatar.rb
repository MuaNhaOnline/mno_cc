class InvestorsAddAvatar < ActiveRecord::Migration
  def change
  	add_column :investors, :avatar_image_id, :integer
  end
end
