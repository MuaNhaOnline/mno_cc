json.array!(@purposes) do |purpose|
  json.extract! purpose, :id, :name, :code, :options
  json.url purpose_url(purpose, format: :json)
end
