class AddImageToAppraisalCompany < ActiveRecord::Migration
  def change
  	add_column :appraisal_companies, :avatar_image_id, :integer
  end
end
