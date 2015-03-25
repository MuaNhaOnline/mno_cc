json.array!(@real_estate_types) do |real_estate_type|
  json.extract! real_estate_type, :id, :name, :code, :options
  json.url real_estate_type_url(real_estate_type, format: :json)
end
