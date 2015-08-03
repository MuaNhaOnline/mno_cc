class ImagesController < ApplicationController

  skip_before_filter :verify_authenticity_token, :only => [:upload]

  def get_image
    begin
      image = Image.find(params['id'])

      send_file Image.get_path(image), filename: image.name
    rescue ActiveRecord::RecordNotFound
      render nothing: true
    end
  end

  def upload
    image = Image.save_image params

    if image.errors.any?
      render json: Hash[status: 1, result: image.errors.full_messages]
    else
      render json: Hash[status: 0, result: image.id]
    end
  end

end
