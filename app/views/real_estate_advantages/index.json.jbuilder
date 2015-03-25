json.array!(@real_estate_advantages) do |real_estate_advantage|
  json.extract! real_estate_advantage, :id, :real_estate_id, :advantage_id
  json.url real_estate_advantage_url(real_estate_advantage, format: :json)
end
