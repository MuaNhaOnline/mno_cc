class Image < ActiveRecord::Base

  def self.save_image image_params
    # create image
    image = Image.create(name: image_params['file'].original_filename)

    # update image path
    image.path = get_link_path(image_params['type'], image.id.to_s + '_' + image.name)
    image.save

    File.open(get_save_path(image_params['type'], image.id.to_s + '_' + image.name), "wb") do |f| f.write(image_params['file'].read) end

    image
  end

  def self.get_save_path type, name
    case type
      when 'real_estate'
        folder = 'real_estate'
      else
        folder = 'stuff'
    end

    "app/assets/images/#{folder}/#{name}"
  end

  def self.get_link_path type, name
    case type
      when 'real_estate'
        folder = 'real_estate'
      else
        folder = 'stuff'
    end

    "/assets/#{folder}/#{name}"
  end

end
