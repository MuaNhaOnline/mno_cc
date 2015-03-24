json.array!(@currencies) do |currency|
  json.extract! currency, :id, :name, :code, :options
  json.url currency_url(currency, format: :json)
end
