class InvestorsRenameAvatarToLogoAddFullLogoDescription < ActiveRecord::Migration
  def change
  	remove_column :investors, :avatar_image_id

  	rename_column :investors, :avatar_file_name, :logo_file_name
  	rename_column :investors, :avatar_content_type, :logo_content_type
  	rename_column :investors, :avatar_file_size, :logo_file_size
  	rename_column :investors, :avatar_updated_at, :logo_updated_at

  	add_attachment :investors, :full_logo
  end
end
