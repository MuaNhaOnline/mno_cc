json.array!(@districts) do |district|
  json.extract! district, :id, :name, :code, :province_id
  json.url district_url(district, format: :json)
end
