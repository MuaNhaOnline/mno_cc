json.array!(@real_estate_utilities) do |real_estate_utility|
  json.extract! real_estate_utility, :id, :name, :code, :options
  json.url real_estate_utility_url(real_estate_utility, format: :json)
end
