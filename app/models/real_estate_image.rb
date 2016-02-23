class RealEstateImage < ActiveRecord::Base

  has_attached_file :image, 
  	# Slide: 1.52
  	styles: { thumb: '360x270#', slide: '760x500#' },
  	default_url: "/assets/real_estates/:style/default.png", 
  	:path => ":rails_root/app/assets/file_uploads/real_estate_images/:style/:id_:filename", 
  	:url => "/assets/real_estate_images/:style/:id_:filename"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  default_scope { order('is_avatar desc, "order" asc') }

end
