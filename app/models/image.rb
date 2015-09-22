class Image < ActiveRecord::Base

  def self.save_image image_params
    # create image
    image = Image.create name: (image_params[:file_name] || image_params[:file].original_filename).gsub('-', '_')

    File.open(get_path(image), 'wb') do |f| f.write(image_params['file'].read) end

    image
  end

  def self.get_path image
    "app/assets/file_uploads/file_uploads/#{image.id}_#{image.name}"
  end
end
