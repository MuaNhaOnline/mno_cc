class RealEstatesAddSlug < ActiveRecord::Migration
  def change
	add_column :real_estates, :slug, :string
  end
end
