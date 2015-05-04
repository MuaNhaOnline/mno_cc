json.array!(@project_types) do |project_type|
  json.extract! project_type, :id, :name, :code, :options, :order
  json.url project_type_url(project_type, format: :json)
end
