class TemporaryFilesController < ApplicationController
  def upload
    file = TemporaryFile.save_with_param params

    if file.errors.any?
      render json: { status: 2 }
    else
      render json: { status: 0, result: file.id }
    end
  end

end
