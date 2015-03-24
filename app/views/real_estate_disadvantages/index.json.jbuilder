json.array!(@real_estate_disadvantages) do |real_estate_disadvantage|
  json.extract! real_estate_disadvantage, :id, :real_estate_id, :disadvantage_id
  json.url real_estate_disadvantage_url(real_estate_disadvantage, format: :json)
end
