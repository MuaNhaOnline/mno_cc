class Investor < ActiveRecord::Base

  include PgSearch
  pg_search_scope :search, against: [:name]

# Delete
  
  def self.delete_by_id id
    investor = find id

    return { status: 1 } if investor.nil?

    # Author
    return { status: 6 } if User.current.cannot? :delete, investor

    if delete id
      { status: 0 }
    else
      { status: 2 }
    end
  end

# / Delete

# Update

  def self.update_name id, new_name
    investor = find id

    return { status: 1 } if investor.nil?

    # Author
    return { status: 6 } if User.current.cannot? :rename, investor

    investor.name = new_name

    if investor.save
      { status: 0 }
    else
      { status: 2 }
    end
  end

# / Update

end
