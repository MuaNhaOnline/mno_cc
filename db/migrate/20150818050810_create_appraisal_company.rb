class CreateAppraisalCompany < ActiveRecord::Migration
  def change
    create_table :appraisal_companies do |t|
    	t.text :name
    end

    create_table :appraisal_companies_users do |t|
    	t.integer :appraisal_company_id
    	t.integer :user_id
    end
  end
end
