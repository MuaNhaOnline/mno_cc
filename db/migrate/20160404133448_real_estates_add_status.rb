class RealEstatesAddStatus < ActiveRecord::Migration
  def change
  	add_column :real_estates, :status, :string
  end
end
