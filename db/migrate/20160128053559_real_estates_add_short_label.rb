class RealEstatesAddShortLabel < ActiveRecord::Migration
  def change
  	add_column :real_estates, :short_label, :string
  end
end
