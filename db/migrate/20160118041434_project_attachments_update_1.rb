class ProjectAttachmentsUpdate1 < ActiveRecord::Migration
  def change
  	drop_table :project_attachments
    create_table :project_payment_attachments do |t|
    	t.integer :project_id
    	t.text :description
    	t.integer :order
    end

    add_attachment :project_payment_attachments, :file
  end
end
