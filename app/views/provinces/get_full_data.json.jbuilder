district_options = ''
District.get_options(@province_id).each do |district|
  district_options << "<option value=\"#{district['id']}\">#{district['name']}</option>"
end
ward_options = ''
Ward.get_options(@province_id).each do |ward|
  ward_options << "<option value=\"#{ward['id']}\">#{ward['name']}</option>"
end
street_options = ''
Street.get_options(@province_id).each do |street|
  street_options << "<option value=\"#{street['id']}\">#{street['name']}</option>"
end

json.array!([
    district_options,
    ward_options,
    street_options
])