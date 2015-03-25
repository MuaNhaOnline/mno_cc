json.array!(@planning_status_types) do |planning_status_type|
  json.extract! planning_status_type, :id, :name, :code, :options
  json.url planning_status_type_url(planning_status_type, format: :json)
end
