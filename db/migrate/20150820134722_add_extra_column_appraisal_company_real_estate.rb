class AddExtraColumnAppraisalCompanyRealEstate < ActiveRecord::Migration
  def change
  	add_column :appraisal_companies_real_estates, :assigned_time, :datetime
  	add_column :appraisal_companies_real_estates, :price, :text
  	add_column :appraisal_companies_real_estates, :is_selected, :boolean, default: false
  end
end
