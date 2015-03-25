json.array!(@region_utilities) do |region_utility|
  json.extract! region_utility, :id, :name, :code, :options
  json.url region_utility_url(region_utility, format: :json)
end
