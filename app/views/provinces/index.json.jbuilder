json.array!(@provinces) do |province|
  json.extract! province, :id, :name, :code
  json.url province_url(province, format: :json)
end
