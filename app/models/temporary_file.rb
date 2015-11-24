class TemporaryFile < ActiveRecord::Base
  def self.save_with_param params
  	# Create file
    file = create name: (params[:file_name] || params[:file].original_filename).gsub('-', '_').gsub(' ', '_')
    File.open(file.path, 'wb') do |f| f.write(params['file'].read) end

    file
  end

  def path
    @path ||= "app/assets/file_uploads/temporary_files/#{id}_#{name}"
  end

  def self.split_old_new arr
  	result = { new: [], old: [] }

  	arr.each do |i|
  		value = i.split ',', 2
  		if value[0] == '1'
  			result[:new] << value[1]
  		else
  			result[:old] << value[1]
  		end
  	end

    return result
  end

  def self.get_file id
    _f = TemporaryFile.find(id)
    
    if File.exists? _f.path
      _file = File.new _f.path

      yield _file

      _file.close
    end
  end

  def self.get_files ids
    TemporaryFile.find(ids).each do |_f|
      if File.exists? _f.path
        _file = File.new _f.path

        yield _file

        _file.close
      end
    end
  end

  # def self.transfer_to file_infos
  #   file_infos.each do |_v|
  #     _value = JSON.parse _v
  #     _value['is_avatar'] ||= false

  #     if _value['is_new']
  #       TemporaryFile.get_file(_value['id']) do |_image, _id|
  #         _images << RealEstateImage.new(image: _image, is_avatar: _value['is_avatar'], description: _value['description'])

  #         _has_avatar = true if _value['is_avatar']
  #       end
  #     else
  #       _image = RealEstateImage.find _value['id']
  #       _image.description = _value['description']
  #       _image.is_avatar = _value['is_avatar']
  #       _image.save if _image.changed?          

  #       _has_avatar = true if _value['is_avatar']

  #       _images << _image
  #     end
  #   end
  # end

  def self.get_file_name_by_file file
    File.basename(file.path).split('_', 2)[1]
  end
end
