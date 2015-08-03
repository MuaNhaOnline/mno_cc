class AddColumnOptionsIntoPositionTables < ActiveRecord::Migration
  def change
		add_column :provinces, :options, :text
		add_column :districts, :options, :text
		add_column :wards, :options, :text
		add_column :streets, :options, :text
  end
end
