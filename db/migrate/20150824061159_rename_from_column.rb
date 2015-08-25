class RenameFromColumn < ActiveRecord::Migration
  def change
		rename_column :mail_boxes, :form_id, :from_id
  end
end
