class ProjectPaymentAttachment < ActiveRecord::Base

	has_attached_file :file, 
	default_url: "/assets/file_extensions/file.png", 
	:path => ":rails_root/app/assets/file_uploads/project_payment_attachments/:id_:filename", 
	:url => "/assets/project_payment_attachments/:id_:filename"

	do_not_validate_attachment_file_type :file

	default_scope { order('"order" asc') }
	
end
