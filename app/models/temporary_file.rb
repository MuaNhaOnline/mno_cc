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
