json.array!(@streets) do |street|
  json.extract! street, :id, :name, :code, :ward_id
  json.url street_url(street, format: :json)
end
