class ReRegistrationsAddExpiresAt < ActiveRecord::Migration
  def change
  	add_column :re_registrations, :expires_at, :datetime
  end
end
