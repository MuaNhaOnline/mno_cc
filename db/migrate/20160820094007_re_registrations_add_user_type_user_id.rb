class ReRegistrationsAddUserTypeUserId < ActiveRecord::Migration
  def change
  	add_column :re_registrations, :user_type, :string
  	add_column :re_registrations, :user_id, :integer
  end
end
