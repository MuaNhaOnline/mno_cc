Rails.application.config.after_initialize do
  create_directory 'app/assets/file_uploads'
  create_directory 'app/assets/file_uploads/temporary_files'
  create_directory 'app/assets/file_uploads/project_attachments'
end

def create_directory path
	Dir.mkdir path unless Dir.exists? path
end