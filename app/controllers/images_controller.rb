class ImagesController < ApplicationController

  skip_before_filter :verify_authenticity_token, :only => [:upload]

  def upload
    image = Image.save_image params

    if image.errors.any?
      render json: Hash[status: 0, result: image.errors.full_messages]
    else
      render json: Hash[status: 1, result: Hash[id: image.id, path: image.path]]
    end
  end

end
