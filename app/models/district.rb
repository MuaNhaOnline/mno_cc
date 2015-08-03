class District < ActiveRecord::Base

  def options_hash
    @options_hash
  end
  def options_hash= options_hash
    @options_hash = options_hash
  end

  after_find do |this|
    begin
      this.options_hash = JSON.parse(this.options)
    rescue

    end
  end

  def self.get_options province_id
        where(province_id: province_id).order(name: 'ASC')
  end

end
