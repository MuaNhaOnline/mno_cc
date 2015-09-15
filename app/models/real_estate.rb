class RealEstate < ActiveRecord::Base

  include PgSearch
  pg_search_scope :search, against: [:meta_search]

  serialize :params, JSON

# Associates

  belongs_to :user
  belongs_to :real_estate_type
  belongs_to :street
  belongs_to :ward
  belongs_to :district
  belongs_to :province
  belongs_to :currency
  belongs_to :purpose
  belongs_to :sell_unit, class_name: 'Unit'
  belongs_to :rent_unit, class_name: 'Unit'
  belongs_to :legal_record_type
  belongs_to :planning_status_type
  belongs_to :constructional_level
  belongs_to :direction

  has_many :appraisal_companies_real_estates
  has_many :appraisal_companies, through: :appraisal_companies_real_estates
  has_many :assigned_appraisal_companies, -> { where("appraisal_companies_real_estates.is_assigned" => true) }, through: :appraisal_companies_real_estates,
            source: :appraisal_company,
            class_name: 'AppraisalCompany'

  has_and_belongs_to_many :property_utilities
  has_and_belongs_to_many :region_utilities
  has_and_belongs_to_many :advantages
  has_and_belongs_to_many :disadvantages
  has_and_belongs_to_many :images
  
# / Associates

# Validates

  validate :custom_validate

  def custom_validate
    # Purpose
    if fields.include?(:purpose) && purpose.blank?
      errors.add :purpose, 'Mục đích không thể bỏ trống'
      return
    end

    # Currency
    if fields.include?(:currency) && currency.blank?
      errors.add :currency, 'Loại tiền tệ không thể bỏ trống'
      return
    end

    # Unit
    if fields.include?(:sell_unit) && sell_unit.blank?
      errors.add :sell_unit, 'Đơn vị tính giá bán không thể bỏ trống'
      return
    end
    if fields.include?(:rent_unit) && rent_unit.blank?
      errors.add :rent_unit, 'Đơn vị tính giá cho thuê không thể bỏ trống'
      return
    end

    # Location
    if fields.include?(:province) && province.blank?
      errors.add :province, 'Tỉnh/thành phố không thể bỏ trống'
      return
    end
    if fields.include?(:district) && province.blank?
      errors.add :district, 'Quận không thể bỏ trống'
      return
    end
    if fields.include?(:street) && province.blank?
      errors.add :street, 'Đường không thể bỏ trống'
      return
    end

    # Alley
    if fields.include?(:alley_width) && alley_width.blank?
      errors.add :alley_width, 'Độ rộng hẻm không thể bỏ trống'
      return
    end

    # Type
    if fields.include?(:real_estate_type) && real_estate_type.blank?
      errors.add :real_estate_type, 'Loại bất động sản không thể bỏ trống'
      return
    end

    # Area
    if fields.include?(:constructional_area) && constructional_area.blank?
      errors.add :constructional_area, 'Diện tích xây dựng không thể bỏ trống'
      return
    end
    if fields.include?(:using_area) && using_area.blank?
      errors.add :using_area, 'Diện tích sử dụng không thể bỏ trống'
      return
    end
    if fields.include?(:campus_area) && campus_area.blank?
      errors.add :campus_area, 'Diện tích khuôn viên không thể bỏ trống'
      return
    end

    # Width
    if fields.include?(:width_x) && width_x.blank?
      errors.add :width_x, 'Chiều ngang không thể bỏ trống'
      return
    end
    if fields.include?(:width_y) && width_y.blank?
      errors.add :width_y, 'Chiều dài không thể bỏ trống'
      return
    end

    # Shape
    if fields.include?(:shape) && shape.blank?
      errors.add :shape, 'Hình dáng không thể bỏ trống'
      return
    end
    if fields.include?(:shape_width) && shape_width.blank?
      errors.add :shape_width, 'Kích thước mặt hậu không thể bỏ trống'
      return
    end

    # Number of ...
    if fields.include?(:floor_number) && floor_number.blank?
      errors.add :floor_number, 'Tầng không thể bỏ trống'
      return
    end
    if fields.include?(:restroom_number) && restroom_number.blank?
      errors.add :restroom_number, 'Số phòng tắm không thể bỏ trống'
      return
    end
    if fields.include?(:bedroom_number) && bedroom_number.blank?
      errors.add :bedroom_number, 'Số phòng ngủ không thể bỏ trống'
      return
    end

    # Direction
    if fields.include?(:direction) && direction.blank?
      errors.add :direction, 'Hướng không thể bỏ trống'
      return
    end

    # Constructional level
    if fields.include?(:constructional_level) && constructional_level.blank?
      errors.add :constructional_level, 'Loại nhà không thể bỏ trống'
      return
    end

    # Build year
    if fields.include?(:build_year) && build_year.blank?
      errors.add :build_year, 'Năm xây dựng không thể bỏ trống'
      return
    end

    # Constructional quality
    if fields.include?(:constructional_quality) && constructional_quality.blank?
      errors.add :constructional_quality, 'Hiện trạng không thể bỏ trống'
      return
    end

    # Title
    if fields.include?(:title) && title.blank?
      errors.add :title, 'Tiêu đề không thể bỏ trống'
      return
    end

    # Description
    if fields.include?(:description) && description.blank?
      errors.add :description, 'Mô tả không thể bỏ trống'
      return
    end

    # Legal record type
    if fields.include?(:legal_record_type)
      if legal_record_type.blank?
        errors.add :legal_record_type, 'Hồ sơ pháp lý không thể bỏ trống'
        return
      end
      if fields.include?(:custom_legal_record_type) && custom_legal_record_type.blank?
        errors.add :custom_legal_record_type, 'Hồ sơ pháp lý không thể bỏ trống'
        return
      end
    end

    # Planning status type
    if fields.include?(:planning_status_type)
      if planning_status_type.blank?
        errors.add :planning_status_type, 'Tình trạng quy hoạch không thể bỏ trống'
        return
      end
      if fields.include?(:custom_planning_status_type) && custom_planning_status_type.blank?
        errors.add :custom_planning_status_type, 'Tình trạng quy hoạch không thể bỏ trống'
        return
      end
    end

    # User contact
    if user_id == 0
      if user_full_name.blank?
        errors.add :user_full_name, 'Họ tên liên lạc không thể bỏ trống'
        return
      end
      if user_email.blank?
        errors.add :user_email, 'Email liên lạc không thể bỏ trống'
        return
      end
    end
  end

# / Validates

# Insert

  # Get params

  def self.get_params params
    # Get price
    if params.has_key? :sell_price
      params[:sell_price] = ApplicationHelper.format_i params[:sell_price]
      params[:sell_price_text] = ApplicationHelper.read_money params[:sell_price]
    end
    if params.has_key? :rent_price
      params[:rent_price] = ApplicationHelper.format_i(params[:rent_price])
      params[:rent_price_text] = ApplicationHelper.read_money params[:rent_price]
    end

    # Alley width
    params[:alley_width] = ApplicationHelper.format_f params[:alley_width] if params.has_key? :alley_width

    # Area
    params[:constructional_area] = ApplicationHelper.format_f params[:constructional_area] if params.has_key? :constructional_area
    params[:using_area] = ApplicationHelper.format_f params[:using_area] if params.has_key? :using_area
    params[:campus_area] = ApplicationHelper.format_f params[:campus_area] if params.has_key? :campus_area
    params[:width_x] = ApplicationHelper.format_f params[:width_x] if params.has_key? :width_x
    params[:width_y] = ApplicationHelper.format_f params[:width_y] if params.has_key? :width_y

    # Location
    unless params[:street].blank?
      street = Street.find_by_name(params[:street])
      street = Street.create(name: params[:street]) if street.nil?
      params[:street_id] = street.id
    end
    unless params[:ward].blank?
      ward = Ward.find_by_name(params[:ward])
      ward = Ward.create(name: params[:ward]) if ward.nil?
      params[:ward_id] = ward.id
    end
    unless params[:district].blank?
      district = District.find_by_name(params[:district])
      district = District.create(name: params[:district]) if district.nil?
      params[:district_id] = district.id
    end
    unless params[:province].blank?
      province = Province.find_by_name(params[:province])
      province = Province.create(name: params[:province]) if province.nil?
      params[:province_id] = province.id
    end

    # Advantages, disavantage, property utility, region utility
    params[:advantage_ids] = [] unless params.has_key? :advantage_ids
    params[:disadvantage_ids] = [] unless params.has_key? :disadvantage_ids
    params[:property_utility_ids] = [] unless params.has_key? :property_utility_ids
    params[:region_utility_ids] = [] unless params.has_key? :region_utility_ids

    # Images 
    params[:image_ids] = params[:image_ids].blank? ? [] : params[:image_ids].split(',').take(5)

    # Get fields
    params.permit [
      :title, :description, :purpose_id, :sell_price, :sell_price_text, :rent_price, :rent_price_text, 
      :currency_id, :sell_unit_id, :rent_unit_id, :is_negotiable, :province_id, :district_id, :ward_id, :street_id, 
      :address_number, :street_type, :is_alley, :real_estate_type_id,
      :legal_record_type_id, :planning_status_type_id, :custom_advantages, :custom_disadvantages,
      :alley_width, :shape_width, :custom_legal_record_type, :custom_planning_status_type, :is_draft,
      :lat, :long, :user_id, :appraisal_purpose, :appraisal_type, :campus_area, :using_area, :constructional_area,
      :shape, :shape_width, :bedroom_number, :build_year, :constructional_level_id, :restroom_number,
      :width_x, :width_y, :floor_number, :constructional_quality, :direction_id,
      advantage_ids: [], disadvantage_ids: [], property_utility_ids: [], region_utility_ids: [],
      image_ids: []
    ]
  end

  # Save with params

  def save_with_params params, is_draft = false
    # Author
    return { status: 6 } if is_draft == true && !User.signed?
    if new_record?
      return { status: 6 } if User.current.cannot? :create, RealEstate
    else
      return { status: 6 } if User.current.cannot? :edit, self
    end

    real_estate_params = RealEstate.get_params params

    assign_attributes real_estate_params

    other_params = {
      is_draft: is_draft,
      is_full: params[:is_full],
      is_pending: true
    }

    if user_id == 0
      other_params = other_params.merge params.permit(:user_full_name, :user_phone_number)
      other_params[:params] = { 'remote_ip' => params[:remote_ip] }

      if new_record?
        other_params[:user_email] = params[:user_email]
        other_params[:is_active] = false
        other_params[:params]['secure_code'] = SecureRandom.base64
      end
    end

    assign_attributes other_params

    assign_attributes meta_search: RealEstate.get_meta_search(self)

    if save validate: !is_draft
      { status: 0 }
    else 
      { status: 3 }
    end
  end

  # / Save with params

# / Insert

# Get

  # Get pending

  def self.get_pending
    where(is_pending: true, is_active: true, is_draft: false)
  end

  # / Get pending

  # Get random

  def self.get_random
    order('RANDOM()')
  end

  # / Get random

# / Get

# Updates

  # Update show status

  def self.update_show_status id, is_show
    real_estate = find id

    # Author
    return { status: 6 } if User.current.cannot? :change_show_status, real_estate

    real_estate.is_show = is_show

    if real_estate.save validate: false
      { status: 0 }
    else
      { status: 2 }
    end
  end

  # / Update show status

  # Update pending status

  def self.update_pending_status id, is_pending
    # Author
    return { status: 6 } if User.current.cannot? :approve, RealEstate

    real_estate = find id

    real_estate.is_pending = is_pending

    if real_estate.save validate: false
      { status: 0 }
    else
      { status: 2 }
    end
  end

  # / Update pending status

  # Active

  def self.active id, secure_code
    re = find id

    return { status: 1 } if re.is_active

    return { status: 0, result: 1 } if re.params['secure_code'] != secure_code

    re.is_active = true
    re.save
    { status: 0, result: 0 }
  end

  # / Active

# / Update

# Helper

  # Get fields

  def self.get_fields re
    fields = [
      :purpose, :currency, :is_negotiable,
      :address_number, :province, :district, :ward, :street, :lat, :long,
      :title, :description, :image]

    fields << :sell_price << :sell_unit if re.purpose.code === 'sell' || re.purpose.code === 'sell_rent'
    fields << :rent_price << :rent_unit if re.purpose.code === 'rent' || re.purpose.code === 'sell_rent'

    if re.is_full
      fields << :street_type << :is_alley
      fields << :alley_width if re.is_alley
      fields << :real_estate_type << :region_utility << :advantage << :disadvantage

      if re.purpose.code == 'sell' || re.purpose.code == 'sell_rent'
        fields << :legal_record_type << :planning_status_type
        fields << :custom_legal_record_type if re.legal_record_type_id == 0
        fields << :custom_planning_status_type if re.planning_status_type_id == 0
      end

      case re.real_estate_type.options_hash['group']
        when 'land'
          fields << :campus_area << :shape << :width_x << :width_y
        when 'space', 'house'
          fields << :campus_area << :using_area << :constructional_area << :restroom_number << :bedroom_number << :build_year <<
            :constructional_level << :constructional_quality << :direction << :shape << :width_x << :width_y << :property_utility
          if real_estate_type.options_hash['group'] == 'house'
            fields << :floor_number
            if real_estate_type.name == 'villa'
              fields.delete :constructional_level
            end
          end
        when 'apartment'
          fields << :using_area << :floor_number << :bedroom_number << :restroom_number <<
            :build_year << :constructional_quality << :direction << :property_utility
      end
    else
      fields << :campus_area
    end

    fields
  end

  # / Get fields

  # Get meta search

  def self.get_meta_search re
    tempLocale = I18n.locale
    I18n.locale = 'vi'

    meta_search = "#{I18n.t('real_estate_type.text.' + re.real_estate_type.name) if re.fields.include?(:real_estate_type) && re.real_estate_type.present?} #{I18n.t('purpose.text.' + re.purpose.name) if re.fields.include?(:purpose) && re.purpose.present?} #{re.street.name if re.fields.include?(:street) && re.street.present?} #{re.district.name if re.fields.include?(:district) && re.district.present?} #{re.province.name if re.fields.include?(:province) && re.province.present?} #{re.title}"
    
    I18n.locale = tempLocale

    meta_search
  end

  # / Get meta search

# / Helper

# Delete
  
  def self.delete_by_id id
    real_estate = find id

    return { status: 1 } if real_estate.nil?

    # Author
    return { status: 6 } if User.current.cannot? :delete, real_estate

    if delete id
      { status: 0 }
    else
      { status: 2 }
    end
  end

# / Delete

# Attributes

  # Fields
  def fields
    @fields ||= RealEstate.get_fields self
  end

  # Name
  def name
    @name ||= "#{I18n.t('purpose.text.' + purpose.name) unless purpose.nil?} #{I18n.t('real_estate_type.text.' + real_estate_type.name) unless real_estate_type.nil?} - #{I18n.t('real_estate.attribute.' + (is_alley ? 'alley' : 'facade'))} #{street.name unless street.nil?} #{district.name unless district.nil?} #{province.name unless province.nil?}."
  end

  # Full address
  def display_address
    @display_address ||= "#{address_number} #{street.name unless street.nil?}, #{ward.name unless ward.nil?}, #{district.name unless district.nil?}, #{(province.name == 'Hồ Chí Minh' ? 'Thành Phố ' : '') + province.name unless province.nil?}".titleize
  end

  # Restroom
  def display_restroom
    @display_restroom ||= restroom_number == 4 ? 'Hơn 4' : restroom_number
  end

  # Bedroom
  def display_bedroom
    @display_bedroom ||= bedroom_number == 4 ? 'Hơn 4' : bedroom_number
  end

  # Area
  def display_area
    fields.include?(:campus_area) ? campus_area : (fields.include?(:constructional_area) ? constructional_area : using_area) 
  end

  # Purpose
  def display_purpose
    I18n.t 'purpose.text.' + purpose.name if purpose.present?
  end

  # Sell price
  def display_sell_price
    sell_price || 'Giá thỏa thuận'
  end

  # Rent price
  def display_rent_price
    rent_price || 'Giá thỏa thuận'
  end

# / Attributes



  # Get keyword

  def keyword
    legal = legal_record_type_id == 0 ? legal_record_type.name : custom_legal_record_type
    alley = is_alley == 1 ? 'Hẻm' : 'Mặt tiền'

    keyword =  
      "#{name}, #{purpose.name} #{real_estate_type.name} quận #{district.name}, #{real_estate_type.name} #{legal}, #{real_estate_type.name} #{alley}, #{alley} quận #{district.name}, #{street.name} quận #{district.name}, #{purpose.name}, #{province.name}, #{real_estate_type.name}, #{legal}"
  end

  # / Get keyword

end