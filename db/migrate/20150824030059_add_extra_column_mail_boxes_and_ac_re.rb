class AddExtraColumnMailBoxesAndAcRe < ActiveRecord::Migration
  def change
  	add_column :mail_boxes, :reply_id, :integer
  	add_column :mail_boxes, :is_from_remove, :boolean, default: false
  	add_column :mail_boxes, :is_to_remove, :boolean, default: false
  	add_column :mail_boxes, :params, :text

  	add_column :appraisal_companies_real_estates, :status, :text
  	add_column :appraisal_companies_real_estates, :analysis, :text
  	add_column :appraisal_companies_real_estates, :note, :text
  	add_column :appraisal_companies_real_estates, :params, :text
  end
end
