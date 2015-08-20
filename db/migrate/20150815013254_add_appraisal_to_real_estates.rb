class AddAppraisalToRealEstates < ActiveRecord::Migration
  def change
  	add_column :real_estates, :appraisal_purpose, :integer
  	add_column :real_estates, :appraisal_type, :integer, default: 0
  	add_column :real_estates, :appraisal_price, :text
  end
end
