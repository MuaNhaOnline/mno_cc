class BlockImage < ActiveRecord::Base

  has_attached_file :image, 
  	styles: { thumb: '360x270#' },
  	default_url: "/assets/blocks/:style/default.png", 
  	:path => ":rails_root/app/assets/file_uploads/block_images/:style/:id_:filename", 
  	:url => "/assets/block_images/:style/:id_:filename"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  default_scope { order('is_avatar desc') }

end
