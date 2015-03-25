json.array!(@wards) do |ward|
  json.extract! ward, :id, :name, :code, :district_id
  json.url ward_url(ward, format: :json)
end
