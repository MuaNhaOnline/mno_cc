json.array!(@property_utilities) do |property_utility|
  json.extract! property_utility, :id, :name, :code, :options
  json.url property_utility_url(property_utility, format: :json)
end
