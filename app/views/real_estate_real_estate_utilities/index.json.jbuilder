json.array!(@real_estate_real_estate_utilities) do |real_estate_real_estate_utility|
  json.extract! real_estate_real_estate_utility, :id, :real_estate_id, :real_estate_utility_id
  json.url real_estate_real_estate_utility_url(real_estate_real_estate_utility, format: :json)
end
