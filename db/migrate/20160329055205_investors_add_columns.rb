class InvestorsAddColumns < ActiveRecord::Migration
  def change
  	add_column :investors, :address, :string
  	add_column :investors, :email, :string
  	add_column :investors, :phone, :string
  	add_column :investors, :representation_id, :integer
  end
end
