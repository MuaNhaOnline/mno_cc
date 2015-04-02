class District < ActiveRecord::Base

  def self.get_options province_id
        where(province_id: province_id).order(name: 'ASC')
  end

end
