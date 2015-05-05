class CreateProjectsTable < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.text :title
      t.text :description
      t.integer :province_id
      t.integer :district_id
      t.integer :street_id
      t.text :address_number
      t.integer :project_type_id
      t.decimal :campus_area
      t.decimal :width_x
      t.decimal :width_y
      t.decimal :using_ratio
      t.datetime :estimate_starting_date
      t.datetime :estimate_finishing_date
      t.datetime :starting_date
      t.datetime :finished_base_date
      t.datetime :transfer_date
      t.datetime :docs_issue_date
      t.integer :investor_id
      t.text :execute_unit
      t.text :design_unit
      t.text :manage_unit
      t.text :payment_method
      t.decimal :unit_price
      t.integer :currency_id
      t.integer :is_show, default: 1
      t.integer :is_pending, default: 1
    end
  end
end
