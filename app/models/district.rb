class District < ActiveRecord::Base
  default_scope { order('districts.order asc') }
end
