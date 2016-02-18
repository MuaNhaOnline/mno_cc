class ContactUserInfosAddDemand < ActiveRecord::Migration
  def change
  	add_column :contact_user_infos, :demand, :string
  end
end
