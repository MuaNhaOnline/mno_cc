class ProjectImage < ActiveRecord::Base

  has_attached_file :image, 
  	styles: { thumb: '260x195#', slide: '960x540#' },
  	default_url: "/assets/projects/:style/default.png", 
  	:path => ":rails_root/app/assets/file_uploads/project_images/:style/:id_:filename", 
  	:url => "/assets/project_images/:style/:id_:filename"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  default_scope { order('is_avatar desc, "order" asc') }

end
