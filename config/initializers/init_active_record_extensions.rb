module ActiveRecordExtensions
  def page page, per
    offset = (page - 1) * per
    limit(per).offset(offset)
  end
end
ActiveRecord::Base.extend ActiveRecordExtensions