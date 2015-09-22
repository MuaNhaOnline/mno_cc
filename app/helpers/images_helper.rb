module ImagesHelper
	def image_path image
		"/assets/file_uploads/#{image.id}_#{image.name}"
	end
end
