class CreateAppraisalCompaniesRealEstates < ActiveRecord::Migration
  def change
    create_table :appraisal_companies_real_estates do |t|
    	t.integer :appraisal_company_id, :integer
    	t.integer :real_estate_id, :integer
    end
  end
end
