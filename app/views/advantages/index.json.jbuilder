json.array!(@advantages) do |advantage|
  json.extract! advantage, :id, :name, :code, :options
  json.url advantage_url(advantage, format: :json)
end
