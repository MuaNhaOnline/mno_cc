class TestingController < ApplicationController
  skip_before_filter :verify_authenticity_token, :only => [:result]
  def index
  end

  def result
    path = Rails.root.join('assets', 'images', params['file'].original_filename)
    File.open(path, "wb")
  end
end
