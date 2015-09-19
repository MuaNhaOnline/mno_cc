class Investor < ActiveRecord::Base

  include PgSearch
  pg_search_scope :search, against: [:name]

# Associates

  belongs_to :avatar_image, class_name: 'Image'

# / Associates

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

  def self.update_name id, new_name, avatar_image_id
    investor = find id

    return { status: 1 } if investor.nil?

    # Author
    return { status: 6 } if User.current.cannot? :rename, investor

    investor.assign_attributes name: new_name, avatar_image_id: avatar_image_id

    if investor.save
      { status: 0 }
    else
      { status: 2 }
    end
  end

# / Update

end
