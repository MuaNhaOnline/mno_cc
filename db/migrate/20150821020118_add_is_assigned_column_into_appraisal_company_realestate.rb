class AddIsAssignedColumnIntoAppraisalCompanyRealestate < ActiveRecord::Migration
  def change
  	add_column :appraisal_companies_real_estates, :is_assigned, :boolean
  end
end
