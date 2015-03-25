json.array!(@legal_record_types) do |legal_record_type|
  json.extract! legal_record_type, :id, :name, :code, :options
  json.url legal_record_type_url(legal_record_type, format: :json)
end
