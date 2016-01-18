class ProjectUtilityImage < ActiveRecord::Base

  has_attached_file :image, 
  	styles: { thumb: '360x270#' },
  	default_url: "/assets/project_utilities/:style/default.png", 
  	:path => ":rails_root/app/assets/file_uploads/project_utility_images/:style/:id_:filename", 
  	:url => "/assets/project_utility_images/:style/:id_:filename"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  default_scope { order('"order" asc') }

end
