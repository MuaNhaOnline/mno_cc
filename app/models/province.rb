class Province < ActiveRecord::Base
  default_scope { order('provinces.order asc') }
end
