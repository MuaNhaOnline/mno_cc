json.array!(@real_estate_region_utilities) do |real_estate_region_utility|
  json.extract! real_estate_region_utility, :id, :real_estate_id, :region_utility_id
  json.url real_estate_region_utility_url(real_estate_region_utility, format: :json)
end
