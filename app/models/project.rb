class Project < ActiveRecord::Base

  include PgSearch
  pg_search_scope :search, against: {
    meta_search_1: 'A',
    meta_search_2: 'B',
    meta_search_3: 'C'
  }, using: { tsearch: { prefix: true, any_word: true } }

# Associates

  belongs_to :user
  belongs_to :project_type
  belongs_to :street
  belongs_to :ward
  belongs_to :district
  belongs_to :province
  belongs_to :currency
  belongs_to :price_unit, class_name: 'Unit'
  belongs_to :investor

  has_many :images, -> { order('is_avatar desc') }, class_name: 'ProjectImage'

# / Associates

# Validates

  validates :project_name, presence: { message: 'Tên dự án không được bỏ trống' }
  validates :title, presence: { message: 'Tiêu đề không được bỏ trống' }
  validates :description, presence: { message: 'Mô tả không được bỏ trống' }
  validates :province_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :district_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :street_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :campus_area, presence: { message: 'Diện tích khuôn viên không được bỏ trống' }
  validates :date_display_type, presence: { message: 'Cách hiển thị không được bỏ trống' }
  validates :price_unit_id, presence: { message: 'Đơn vị tính không được bỏ trống' }

  validate :custom_validate

  def custom_validate
    errors.add(:images, 'Có tối thiểu 1 hình ảnh') if images.length == 0
  end

# / Validates

# Insert

  # Get params

  def assign_attributes_with_params params
    # Get price
    if params.has_key? :unit_price
      params[:unit_price] = ApplicationHelper.format_i(params[:unit_price])
      params[:unit_price_text] = ApplicationHelper.read_money params[:unit_price]
    end

    # Area
    params[:campus_area] = ApplicationHelper.format_f params[:campus_area] if params.has_key? :campus_area
    params[:width_x] = ApplicationHelper.format_f params[:width_x] if params.has_key? :width_x
    params[:width_y] = ApplicationHelper.format_f params[:width_y] if params.has_key? :width_y

    # Constructional quality
    if params.has_key? :using_ratio
      using_ratio = ApplicationHelper.format_i(params[:using_ratio]).to_i
      params[:using_ratio] = using_ratio < 0 ? 0 : (using_ratio > 100 ? 100 : using_ratio)
    end

    # Investor
    if params[:investor_id] == '0' && !params[:investor_id_ac].blank?
      investor = Investor.find_or_create_by name: params[:investor_id_ac]
      params[:investor_id] = investor.id
    end

    # Location
    unless params[:province].blank?
      if params[:province] == 'Hồ Chí Minh'
        params[:province] = 'Tp. Hồ Chí Minh'
      end
      province = Province.find_or_create_by name: params[:province]
      params[:province_id] = province.id
    end
    unless params[:district].blank?
      district = District.find_or_create_by name: params[:district], province_id: params[:province_id]
      params[:district_id] = district.id
    end
    unless params[:ward].blank?
      ward = Ward.find_or_create_by name: params[:ward]
      params[:ward_id] = ward.id
    end
    unless params[:street].blank?
      street = Street.find_or_create_by name: params[:street]
      params[:street_id] = street.id
    end

    # Images

    _images = []
    _has_avatar = false
    if params[:image_ids].present?
      _image_values = TemporaryFile.split_old_new params[:image_ids].split(';').take(5)

      _avatar_value = nil
      if params[:avatar_id].present?
        _avatar_value = params[:avatar_id].split(',')
      end

      if _image_values[:old].present?
        _images = ProjectImage.find _image_values[:old]

        if _avatar_value.present? && _avatar_value[1] == '0'
          _images.each do |_image|
            if _image.id.to_s == _avatar_value[0]
              _image.update is_avatar: true unless _image.is_avatar
              _has_avatar = true
            else
              _image.update is_avatar: false if _image.is_avatar
            end
          end
        else
          _images.each do |_image|
            _image.update is_avatar: false if _image.is_avatar
          end
        end
      end

      if _image_values[:new].present?
        if _avatar_value.present? && _avatar_value[1] == '1'
          TemporaryFile.get_files(_image_values[:new]) do |_image, _id|
            if _id.to_s == _avatar_value[0]
              _images << ProjectImage.new(image: _image, is_avatar: true)
              _has_avatar = true
            else
              _images << ProjectImage.new(image: _image, is_avatar: false)
            end
          end
        else
          TemporaryFile.get_files(_image_values[:new]) do |_image, _id|
            _images << ProjectImage.new(image: _image)
          end
        end
      end
    end
    if !_has_avatar && _images.length != 0
      _images[0].assign_attributes is_avatar: true
    end
    assign_attributes images: _images

    assign_attributes params.permit [
      :project_name, :title, :description, :unit_price, :unit_price_text, :currency_id, :payment_method, 
      :price_unit_id,
      :lat, :long, :address_number, :province_id, :district_id, :ward_id, :street_id, 
      :project_type_id, :campus_area, :width_x, :width_y, :is_draft,
      :using_ratio, :estimate_starting_date, :estimate_finishing_date,
      :starting_date, :finished_base_date, :transfer_date, :docs_issue_date,
      :investor_id, :execute_unit, :design_unit, :manage_unit, :user_id, :date_display_type
    ]
  end

  # Save with params

  def save_with_params params, is_draft = false
    # Author
    if new_record?
      return { status: 6 } if User.current.cannot? :create, Project
    else
      return { status: 6 } if User.current.cannot? :edit, self
    end

    assign_attributes_with_params params

    other_params = {
      is_draft: is_draft,
      is_pending: true
    }

    assign_attributes other_params

    assign_meta_search

    if save validate: !is_draft
      { status: 0 }
    else 
      { status: project_params[:date_display_type] }
    end
  end

  # / Save with params

# / Insert

# Updates

  # Update show status

  def self.update_show_status id, is_show
    project = find id

    # Author
    return { status: 6 } if User.current.cannot? :change_show_status, project

    project.is_show = is_show

    if project.save validate: false
      { status: 0 }
    else
      { status: 2 }
    end
  end

  # / Update show status

  # Update pending status

  def self.update_pending_status id, is_pending
    # Author
    return { status: 6 } if User.current.cannot? :approve, Project

    project = find id

    project.is_pending = is_pending

    if project.save validate: false
      { status: 0 }
    else
      { status: 2 }
    end
  end

  # / Update pending status

  # Update force hide status

  def self.update_force_hide_status id, is_force_hide
    project = find id

    # Author
    return { status: 6 } if User.current.cannot? :change_force_hide_status, project

    project.is_force_hide = is_force_hide

    if project.save validate: false
      { status: 0 }
    else
      { status: 2 }
    end
  end

  # / Update force hide status

  # Update favorite status

  def self.update_favorite_status id, is_favorite
    project = find id

    # Author
    return { status: 6 } if User.current.cannot? :change_favorite_status, project

    project.is_favorite = is_favorite

    if project.save validate: false
      { status: 0 }
    else
      { status: 2 }
    end
  end

  # / Update favorite status

# / Update

# Delete
  
  def self.delete_by_id id
    project = find id

    return { status: 1 } if project.nil?

    # Author
    return { status: 6 } if User.current.cannot? :delete, project

    delete id

    { status: 0 }
  end

# / Delete

# Get

  # Search with params

  # params: 
  #   page, price(x;y), district
  #   newest
  def self.search_with_params params = {}
    where = 'is_pending = false AND is_show = true'
    joins = []
    order = {}

    if params.has_key? :price
      price_range = params[:price].split(';')
      where += " AND unit_price IS NOT NULL AND unit_price BETWEEN #{price_range[0]} AND #{price_range[1]}"
      
      order[:unit_price] = 'asc'
    end

    if params.has_key? :district
      joins << :district
      where += " AND districts.id = #{params[:district]} "
    end

    if params.has_key? :newest
      order[:created_at] = 'asc'
    end

    joins(joins).where(where).order(order)
  end

  # params: 
  #   keyword,
  #   newest, cheapest, interact, view, id, favorite
  def self.my_search_with_params params = {}
    where = "user_id = #{User.current.id}"
    joins = []
    order = {}

    if params.has_key? :view
      order[:view_count] = params[:view]
    end

    if params.has_key? :interact
      order[:updated_at] = params[:interact]
    end

    if params.has_key? :favorite
      order[:is_favorite] = params[:favorite]
    end

    if params.has_key? :id
      order[:id] = params[:id]
    end

    if params[:keyword].present?
      search(params[:keyword]).joins(joins).where(where).order(order)
    else
      joins(joins).where(where).order(order)
    end
  end

  # params: 
  #   keyword,
  #   newest, cheapest, interact, view, id, favorite
  def self.pending_search_with_params params = {}
    where = 'is_pending = true AND is_draft = false'
    joins = []
    order = {}

    if params.has_key? :view
      order[:view_count] = params[:view]
    end

    if params.has_key? :interact
      order[:updated_at] = params[:interact]
    end

    if params.has_key? :favorite
      order[:is_favorite] = params[:favorite]
    end

    if params.has_key? :id
      order[:id] = params[:id]
    end

    if params[:keyword].present?
      search(params[:keyword]).joins(joins).where(where).order(order)
    else
      joins(joins).where(where).order(order)
    end
  end

  def self.manager_search_with_params params = {}
    where = 'is_pending = false'
    joins = []
    order = {}

    if params.has_key? :view
      order[:view_count] = params[:view]
    end

    if params.has_key? :interact
      order[:updated_at] = params[:interact]
    end

    if params.has_key? :favorite
      order[:is_favorite] = params[:favorite]
    end

    if params.has_key? :id
      order[:id] = params[:id]
    end

    if params[:keyword].present?
      search(params[:keyword]).joins(joins).where(where).order(order)
    else
      joins(joins).where(where).order(order)
    end
  end

  # / Search with params

# / Get

# Helper

  # Get fields

  def self.get_fields p
    []
  end

  # / Get fields

  # Get meta search

  def assign_meta_search
    tempLocale = I18n.locale
    I18n.locale = 'vi'

    assign_attributes meta_search_1: "#{display_id} #{id} #{district.name if district.present?} #{street.name if street.present?}", meta_search_2: "#{title} #{province.name if province.present?} #{investor.name if investor.present?}", meta_search_3: "#{user.full_name + ' ' + user.email + ' ' + user.phone_number if user.present?} #{ward.name if ward.present?} #{I18n.t('project_type.text.' + project_type.name) if project_type.present?}"

    I18n.locale = tempLocale
  end

  # / Get meta search

# / Helper

# Attributes

  # ID
  def display_id
    @id ||= ApplicationHelper.id_format id, 'PR'
  end

  # Full address
  def display_address
    @display_address ||= "#{address_number} #{street.name unless street.nil?}#{', ' + ward.name unless ward.nil?}#{', ' + district.name unless district.nil?}#{', ' + province.name unless province.nil?}".gsub(/\b\w/) { $&.capitalize }
  end

  # Deadline
  def get_string_date date
    if date.present?
      case date_display_type
      when 1
        date = date.strftime '%d/%m/%Y'
      when 2
        case date.month
        when (1..3)
          date = 'Quý 1 năm ' + date.year.to_s
        when (4..6)
          date = 'Quý 2 năm ' + date.year.to_s
        when (7..9)
          date = 'Quý 3 năm ' + date.year.to_s
        when (10..12)
          date = 'Quý 4 năm ' + date.year.to_s
        end
      when 3
        date = 'Năm ' + date.year.to_s
      end
    end

    if date.blank?
      date = ''
    end

    date
  end

  def get_deadline
    date = nil
    if finished_base_date.present?
      date = finished_base_date
    elsif transfer_date.present?
      date = transfer_date
    elsif docs_issue_date.present?
      date = docs_issue_date
    elsif estimate_finishing_date.present?
      date = estimate_finishing_date
    end

    # get_string_date date
    if !date.nil? && DateTime.now > date
      true
    else
      false
    end
  end

  def display_deadline
    @display_deadline ||= get_deadline
  end

  # Unit price
  def get_unit_price
    if unit_price_text.present?
      (unit_price_text + (currency.code != 'VND' ? ' ' + currency.name : '') + I18n.t('unit.text.display_' + price_unit.name)).html_safe
    else
      'Chưa có giá'
    end
  end

  def display_unit_price
    @display_unit_price ||= get_unit_price
  end

# / Attributes

end