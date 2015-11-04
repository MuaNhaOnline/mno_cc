class ImageContent < ActiveRecord::Base
  has_attached_file :image, 
  	default_url: "/assets/image_contents/:style/default.png", 
  	:path => ":rails_root/app/assets/file_uploads/image_contents/:style/:id_:filename", 
  	:url => "/assets/image_contents/:style/:id_:filename"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/
end
