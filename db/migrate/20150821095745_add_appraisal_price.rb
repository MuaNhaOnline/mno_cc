class AddAppraisalPrice < ActiveRecord::Migration
  def change
  	rename_column :appraisal_companies_real_estates, :price, :sell_price
  	add_column :appraisal_companies_real_estates, :rent_price, :text
  end
end
