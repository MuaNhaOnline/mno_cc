class CreatePermissions < ActiveRecord::Migration
  def change
    create_table :permissions do |t|
      t.string :name
      t.string :description
      t.string :value
      t.string :scope
      t.integer :parent_permission_id
      t.integer :order
    end
  end
end
