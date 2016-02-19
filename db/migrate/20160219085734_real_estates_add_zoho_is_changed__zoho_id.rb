class RealEstatesAddZohoIsChangedZohoId < ActiveRecord::Migration
  def change
  	add_column :real_estates, :zoho_id, :string
  	add_column :real_estates, :zoho_is_changed, :boolean
  end
end
