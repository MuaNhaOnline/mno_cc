class Image < ActiveRecord::Base

  def self.save_image image_params
    # create image
    image = Image.create(
        name: image_params['file'].original_filename,
        folder: get_folder(image_params['type'])
    )

    File.open(get_path(image), 'wb') do |f| f.write(image_params['file'].read) end

    image
  end

  def self.get_path image
    "uploads/images/#{image.folder}#{image.id}_#{image.name}"
  end

  def self.get_folder type
    case type
      when 'real_estate'
        folder = 'real_estate/'
      when 'project'
        folder = 'project/'
      else
        folder = 'stuff/'
    end
  end

  def self.get_directory folder
    "uploads/images/#{folder}"
  end

  # def self.get_link_path type, name
  #   case type
  #     when 'real_estate'
  #       folder = 'real_estate'
  #     else
  #       folder = 'stuff'
  #   end
  #
  #   "/assets/#{folder}/#{name}"
  # end

end
