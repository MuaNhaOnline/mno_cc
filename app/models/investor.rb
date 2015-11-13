class Investor < ActiveRecord::Base

  include PgSearch
  pg_search_scope :search, against: [:name], using: { tsearch: { prefix: true, any_word: true } }

  has_attached_file :avatar, 
    styles: { thumb: '250x200#' },
    default_url: "/assets/investors/default.png", 
    :path => ":rails_root/app/assets/file_uploads/investor_images/:style/:id_:filename", 
    :url => "/assets/investor_images/:style/:id_:filename"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\Z/

# Associations

# / Associations

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

  def self.update_name id, new_name, avatar_id
    investor = find id

    return { status: 1 } if investor.nil?

    # Author
    return { status: 6 } if User.current.cannot? :rename, investor

    investor.assign_attributes name: new_name

    if avatar_id.present?
      _value = JSON.parse avatar_id

      if _value['is_new']
        TemporaryFile.get_file(_value['id']) do |_avatar|
          investor.assign_attributes avatar: _avatar
        end
      end
    else
      investor.assign_attributes avatar: nil
    end

    if investor.save
      { status: 0, result: investor }
    else
      { status: 2 }
    end
  end

# / Update

end
