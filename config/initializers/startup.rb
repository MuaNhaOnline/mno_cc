Rails.application.config.after_initialize do
    create_directory 'uploads'
    create_directory 'uploads/images'
    create_directory 'uploads/images/project'
    create_directory 'uploads/images/real_estate'
    create_directory 'uploads/images/stuff'
end

def create_directory path
	Dir.mkdir path unless Dir.exists? path
end