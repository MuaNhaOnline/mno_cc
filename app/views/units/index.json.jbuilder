json.array!(@units) do |unit|
  json.extract! unit, :id, :name, :code, :options
  json.url unit_url(unit, format: :json)
end
