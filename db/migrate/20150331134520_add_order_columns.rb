class AddOrderColumns < ActiveRecord::Migration
  def change
    add_column :advantages, :order, :integer
    add_column :constructional_levels, :order, :integer
    add_column :currencies, :order, :integer
    add_column :directions, :order, :integer
    add_column :disadvantages, :order, :integer
    add_column :legal_record_types, :order, :integer
    add_column :planning_status_types, :order, :integer
    add_column :purposes, :order, :integer
    add_column :real_estate_types, :order, :integer
    add_column :property_utilities, :order, :integer
    add_column :region_utilities, :order, :integer
    add_column :street_types, :order, :integer
    add_column :units, :order, :integer
    add_column :provinces, :order, :integer
    add_column :districts, :order, :integer
    add_column :wards, :order, :integer
    add_column :streets, :order, :integer
  end
end
