class CreateMailBoxes < ActiveRecord::Migration
  def change
    create_table :mail_boxes do |t|
    	t.integer :to_id
    	t.integer :form_id
    	t.text :subject
    	t.text :content
    	t.integer :attachment_file_id
    	t.boolean :is_draft
    	t.datetime :created_at    	
    	t.text :type
    end

    remove_column :appraisal_companies_real_estates, :integer
  end
end
