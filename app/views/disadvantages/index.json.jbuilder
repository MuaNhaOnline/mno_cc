json.array!(@disadvantages) do |disadvantage|
  json.extract! disadvantage, :id, :name, :code, :options
  json.url disadvantage_url(disadvantage, format: :json)
end
