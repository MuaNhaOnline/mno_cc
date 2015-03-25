json.array!(@directions) do |direction|
  json.extract! direction, :id, :name, :code, :options
  json.url direction_url(direction, format: :json)
end
