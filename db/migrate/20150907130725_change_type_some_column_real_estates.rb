class ChangeTypeSomeColumnRealEstates < ActiveRecord::Migration
  def change
  	remove_column :real_estates, :is_negotiable
		add_column :real_estates, :is_negotiable, :boolean
  	remove_column :real_estates, :is_alley
		add_column :real_estates, :is_alley, :boolean
  	remove_column :real_estates, :is_show
		add_column :real_estates, :is_show, :boolean, default: true
  	remove_column :real_estates, :is_paid
		add_column :real_estates, :is_paid, :boolean, default: true
  	remove_column :real_estates, :is_pending
		add_column :real_estates, :is_pending, :boolean, default: true
  	remove_column :real_estates, :is_draft
		add_column :real_estates, :is_draft, :boolean, default: true
  end
end
