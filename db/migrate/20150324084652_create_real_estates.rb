class CreateRealEstates < ActiveRecord::Migration
  def change
    create_table :real_estates do |t|

      t.timestamps null: false
    end
  end
end
