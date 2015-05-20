class RemoveNameAddDraft < ActiveRecord::Migration
  def change
  	remove_column :real_estates, :name
  	remove_column :projects, :name
  	add_column :projects, :is_draft, :integer  	
  end
end
