json.array!(@constructional_levels) do |constructional_level|
  json.extract! constructional_level, :id, :name, :code, :options
  json.url constructional_level_url(constructional_level, format: :json)
end
