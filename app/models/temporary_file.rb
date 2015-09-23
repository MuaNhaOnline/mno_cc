class TemporaryFile < ActiveRecord::Base
  def self.save_with_param params
  	# Create file
    file = create name: (params[:file_name] || params[:file].original_filename).gsub('-', '_')
    File.open(file.path, 'wb') do |f| f.write(params['file'].read) end

    file
  end

  def path
    @path ||= "app/assets/file_uploads/temporary_files/#{id}_#{name}"
  end

  def self.split_old_new arr
  	result = { new: [], old: [] }

  	arr.each do |i|
  		value = i.split ','
  		if value[1] == '1'
  			result[:new] << value[0]
  		else
  			result[:old] << value[0]
  		end
  	end

    return result
  end

  def self.get_files ids
    TemporaryFile.find(ids).each do |_f|
      if File.exists? _f.path
        _file = File.new _f.path

        yield _file, _f.id

        _file.close
      end
    end
  end
end
