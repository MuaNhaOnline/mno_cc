class Province < ActiveRecord::Base

  def self.get_options
    order name: 'ASC'
  end

end
