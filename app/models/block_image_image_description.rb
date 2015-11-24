class BlockImageImageDescription < ActiveRecord::Base

  has_attached_file :image, 
  	styles: { thumb: '360x270#', slide: '800x450#' },
  	default_url: "/assets/blocks/:style/default.png", 
  	:path => ":rails_root/app/assets/file_uploads/block_image_image_descriptions/:style/:id_:filename", 
  	:url => "/assets/block_image_image_descriptions/:style/:id_:filename"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  default_scope { order('is_avatar desc, "order" asc') }

end
