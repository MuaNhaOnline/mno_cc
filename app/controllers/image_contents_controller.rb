class ImageContentsController < ApplicationController

	# Upload

		# Handle
		# params: upload
		def upload
			image_content = ImageContent.new
			image_content.image = params[:upload]
			if image_content.save
				if params[:type] == 'link'
					render plain: image_content.image.url
				else
					render json: { uploaded: 1, fileName: image_content.image_file_name, url: image_content.image.url }
				end
			else
				if params[:type] == 'link'
					render plain: 'Gửi hình ảnh thất bại'
				else
					render json: { uploaded: 0, error: { message: 'Chèn hình ảnh thất bại' } }
				end
			end
		end

	# / Upload

end
