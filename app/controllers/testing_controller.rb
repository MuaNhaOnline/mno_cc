class TestingController < ApplicationController
  skip_before_filter :verify_authenticity_token, :only => [:result]
  def index
  end

  def result
    path = File.join('app/assets/images/real_estate_images', params['file'].original_filename)
    File.open(path, "wb") do |f| f.write(params['file'].read) end
  end
end
