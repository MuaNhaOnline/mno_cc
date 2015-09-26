class Investor < ActiveRecord::Base

  include PgSearch
  pg_search_scope :search, against: [:name], using: { tsearch: { prefix: true, any_word: true } }

  has_attached_file :avatar, 
    styles: { thumb: '250x200#' },
    default_url: "/assets/investors/default.png", 
    :path => ":rails_root/app/assets/file_uploads/investor_images/:style/:id_:filename", 
    :url => "/assets/investor_images/:style/:id_:filename"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\Z/

# Associates

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

  def self.update_name id, new_name, avatar_id
    investor = find id

    return { status: 1 } if investor.nil?

    # Author
    return { status: 6 } if User.current.cannot? :rename, investor

    investor.assign_attributes name: new_name

    if avatar_id
      _avatar_value = TemporaryFile.split_old_new avatar_id.split(';')

      if _avatar_value[:new].present?
        TemporaryFile.get_files(_avatar_value[:new]) do |_avatar, _id|
          investor.assign_attributes avatar: _avatar
        end
      elsif _avatar_value[:old].blank?
        investor.assign_attributes avatar: nil
      end
    end

    if investor.save
      { status: 0, result: investor }
    else
      { status: 2 }
    end
  end

# / Update

end
