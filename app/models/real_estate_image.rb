class RealEstateImage < ActiveRecord::Base

  has_attached_file :image, 
  	styles: { thumb: '260x195#', slide: '800x450#' },
  	default_url: "/assets/real_estates/:style/default.png", 
  	:path => ":rails_root/app/assets/file_uploads/real_estate_images/:style/:id_:filename", 
  	:url => "/assets/real_estate_images/:style/:id_:filename"
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

end
