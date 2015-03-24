json.array!(@images) do |image|
  json.extract! image, :id, :path, :options
  json.url image_url(image, format: :json)
end
