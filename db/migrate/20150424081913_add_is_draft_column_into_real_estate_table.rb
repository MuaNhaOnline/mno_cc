class AddIsDraftColumnIntoRealEstateTable < ActiveRecord::Migration
  def change
    add_column :real_estates, :is_draft, :integer, default: 0
  end
end