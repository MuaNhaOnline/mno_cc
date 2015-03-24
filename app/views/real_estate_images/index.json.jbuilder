json.array!(@real_estate_images) do |real_estate_image|
  json.extract! real_estate_image, :id, :real_estate_id, :image_id
  json.url real_estate_image_url(real_estate_image, format: :json)
end
