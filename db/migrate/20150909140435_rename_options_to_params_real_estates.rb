class RenameOptionsToParamsRealEstates < ActiveRecord::Migration
  def change
  	rename_column :real_estates, :options, :params
  end
end
