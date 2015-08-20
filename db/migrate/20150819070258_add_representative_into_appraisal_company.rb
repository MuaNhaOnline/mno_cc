class AddRepresentativeIntoAppraisalCompany < ActiveRecord::Migration
  def change
  	add_column :appraisal_companies, :representative_id, :integer
  end
end
