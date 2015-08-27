class RealEstate < ActiveRecord::Base

  include PgSearch
  pg_search_scope :search, against: [:meta_search]

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

  validates :user_id, presence: { message: 'Người đăng không thể bỏ trống' }
  validates :title, presence: { message: 'Tiêu đề không được bỏ trống' }
  validates :description, presence: { message: 'Mô tả không được bỏ trống' }
  validates :purpose_id, presence: { message: 'Mục tiêu không được bỏ trống' }
  validates :currency_id, presence: { message: 'Loại tiền không được bỏ trống' }
  validates :province_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :district_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :ward_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :street_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :real_estate_type_id, presence: { message: 'Loại bất động sản không được bỏ trống' }
  validates :width_x, presence: { message: 'Chiều ngang không được bỏ trống' }
  validates :width_y, presence: { message: 'Chiều dài không được bỏ trống' }

  validate :custom_validate

  def custom_validate
    # Appraisal
    errors.add(:appraisal_purpose, 'Mục đích thẩm định không thể bỏ trống') if appraisal_type != 0 && appraisal_purpose.blank?

    fields = RealEstate.get_fields self

    # if sell
    if purpose.code === 'sell' || purpose.code === 'sell_rent'
      errors.add(:legal_record_type_id, 'Hồ sơ không được bỏ trống') if legal_record_type_id.blank?
      errors.add(:planning_status_type_id, 'Tình trạng không được bỏ trống') if planning_status_type_id.blank?
    end

    errors.add(:alley_width, 'Kích thước hẻm không được bỏ trống') if fields.include?(:alley_width) && alley_width.blank?
    errors.add(:shape, 'Hình dáng không được bỏ trống') if fields.include?(:shape) && shape.blank?
    if fields.include? :shape_width
      if shape_width.blank?
        errors.add(:shape_width, 'Kích thước mặt hậu không được bỏ trống') 
      elsif !width_x.blank?
        if shape == 1
          errors.add(:shape_width, 'Mặt hậu không hợp lệ') unless shape_width > width_x
        elsif shape == 2
          errors.add(:shape_width, 'Mặt hậu không hợp lệ') unless shape_width < width_x
        end
      end
    end
    errors.add(:custom_legal_record_type, 'Loại hồ sơ không được bỏ trống') if fields.include?(:custom_legal_record_type) && custom_legal_record_type.blank?
    errors.add(:custom_planning_status_type, 'Tình trạng quy hoạch không được bỏ trống') if fields.include?(:custom_planning_status_type) && custom_planning_status_type.blank?
    errors.add(:campus_area, 'Diện tích khuôn viên không được bỏ trống') if fields.include?(:campus_area) && campus_area.blank?
    errors.add(:using_area, 'Diện tích sử dụng không được bỏ trống') if fields.include?(:using_area) && using_area .blank?
    errors.add(:constructional_level, 'Diện tích xây dựng không được bỏ trống') if fields.include?(:constructional_area) && constructional_area.blank?
    errors.add(:constructional_quality, 'Chất lượng còn lại không được bỏ trống') if fields.include?(:constructional_quality) && constructional_quality.blank?
    errors.add(:images, 'Có tối thiểu 1 hình ảnh') if !id.blank? && images.length == 0    
  end

# / Validates

# Insert

  # Get params

  def self.get_params params
    # Get price
    params[:sell_price] = ApplicationHelper.format_i(params[:sell_price]) if params.has_key? :sell_price
    params[:rent_price] = ApplicationHelper.format_i(params[:rent_price]) if params.has_key? :rent_price

    # Alley width
    params[:alley_width] = ApplicationHelper.format_f params[:alley_width] if params.has_key? :alley_width

    # Area
    params[:constructional_area] = ApplicationHelper.format_f params[:constructional_area] if params.has_key? :constructional_area
    params[:using_area] = ApplicationHelper.format_f params[:using_area] if params.has_key? :using_area
    params[:campus_area] = ApplicationHelper.format_f params[:campus_area] if params.has_key? :campus_area
    params[:width_x] = ApplicationHelper.format_f params[:width_x] if params.has_key? :using_area
    params[:width_y] = ApplicationHelper.format_f params[:width_y] if params.has_key? :campus_area

    # Constructional quality
    if params.has_key? :constructional_quality
      constructional_quality = ApplicationHelper.format_i(params[:constructional_quality]).to_i
      params[:constructional_quality] = constructional_quality < 0 ? 0 : (constructional_quality > 100 ? 100 : constructional_quality)
    end

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

    # Get field

    fields = [
      :title, :description, :purpose_id, :sell_price, :rent_price, :currency_id, :sell_unit_id,
      :rent_unit_id, :is_negotiable, :province_id, :district_id, :ward_id, :street_id, 
      :address_number, :street_type, :is_alley, :real_estate_type_id, :width_x, :width_y,
      :legal_record_type_id, :planning_status_type_id, :custom_advantages, :custom_disadvantages,
      :alley_width, :shape_width, :custom_legal_record_type, :custom_planning_status_type, :is_draft,
      :lat, :long, :user_id, :appraisal_purpose, :appraisal_type,
      :advantage_ids => [], :disadvantage_ids => [], :property_utility_ids => [], :region_utility_ids => [],
      :image_ids => []
    ]

    real_estate_type = RealEstateType.find params[:real_estate_type_id]
    case real_estate_type.options_hash['group']
      when 'land'
        fields << :campus_area << :shape
      when 'space', 'house'
        fields << :campus_area << :using_area << :constructional_area << :restroom_number <<
            :bedroom_number << :build_year << :constructional_level_id << :constructional_quality <<
            :direction_id << :shape
        if real_estate_type.options_hash['group'] == 'house'
          fields << :floor_number
          if real_estate_type.code == 'villa'
            fields.delete :constructional_level_id
          end
        end
      when 'apartment'
        fields << :using_area << :floor_number << :bedroom_number << :restroom_number <<
          :build_year << :constructional_quality << :direction_id
        if real_estate_type.code == 'building-apartment'
          fields << :constructional_level_id
        end
    end

    # / Get fields

    params.permit fields
  end

  # Save with params

  def save_with_params params, is_draft = false
    # Author
    if new_record?
      return { status: 6 } if User.current.cannot? :create, RealEstate
    else
      return { status: 6 } if User.current.cannot? :edit, self
    end

    params[:is_draft] = is_draft ? 1 : 0

    real_estate_params = RealEstate.get_params params

    assign_attributes real_estate_params

    other_params = { 
      is_pending: 1,
      meta_search: RealEstate.get_meta_search(self)
    }

    assign_attributes other_params

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
    where(is_pending: 1, is_draft: 0)
  end

  # / Get pending

# / Get

# Updates

  # Update show status

  def self.update_show_status id, is_show
    real_estate = find id

    real_estate.is_show = is_show

    real_estate.save validate: false
  end

  # / Update show status

  # Update pending status

  def self.update_pending_status id, is_pending
    return { status: 6 } if User.current.cannot? :approve, RealEstate

    real_estate = find id

    real_estate.is_pending = is_pending

    real_estate.save validate: false

    { status: 0 }
  end

  # / Update pending status

# / Update

# Helper

  # Get fields

  def self.get_fields re
    fields = []

    fields << :sell_price if re.purpose.code === 'sell' || re.purpose.code === 'sell_rent'
    fields << :rent_price if re.purpose.code === 'rent' || re.purpose.code === 'sell_rent'

    real_estate_type = RealEstateType.find re.real_estate_type_id
    case real_estate_type.options_hash['group']
      when 'land'
        fields << :campus_area << :shape
      when 'space', 'house'
        fields << :campus_area << :using_area << :constructional_area << :restroom_number <<
            :bedroom_number << :build_year << :constructional_level_id << :constructional_quality <<
            :direction_id << :shape
        if real_estate_type.options_hash['group'] == 'house'
          fields << :floor_number
          if real_estate_type.code == 'villa'
            fields.delete :constructional_level_id
          end
        end
      when 'apartment'
        fields << :using_area << :floor_number << :bedroom_number << :restroom_number <<
          :build_year << :constructional_quality << :direction_id
        if real_estate_type.code == 'building-apartment'
          fields << :constructional_level_id
        end
    end
    fields << :alley_width if re.is_alley == 1
    fields << :shape_width if fields.include?(:shape) && re.shape != 0
    fields << :custom_legal_record_type if re.legal_record_type_id == 0
    fields << :custom_planning_status_type if re.planning_status_type_id == 0

    fields
  end

  # / Get fields

  # Get meta search

  def self.get_meta_search re
    legal = re.legal_record_type_id != 0 ? re.legal_record_type.name : re.custom_legal_record_type
    alley = re.is_alley == 1 ? 'Hẻm' : 'Mặt tiền'

    tempLocale = I18n.locale
    I18n.locale = 'vi'

    meta_search = "#{I18n.t('real_estate_type.text.' + re.real_estate_type.name) unless re.real_estate_type.nil?} #{I18n.t('purpose.text.' + re.purpose.name) unless re.purpose.nil?} đường #{re.street.name unless re.street.nil?} quận #{re.district.name unless re.district.nil?} #{re.province.name unless re.province.nil?} #{re.title}"
    
    I18n.locale = tempLocale

    meta_search
  end

  # / Get meta search

# / Helper

# Delete
  
  def self.delete_by_id id
    real_estate = find id

    return { status: 1 } if real_estate.nil?

    return { status: 6 } if User.current.cannot? :delete, real_estate

    delete id

    { status: 0 }
  end

# / Delete

# Attributes

  # Name

  def name
    @name ||= "#{I18n.t('purpose.text.' + purpose.name) unless purpose.nil?} #{I18n.t('real_estate_type.text.' + real_estate_type.name) unless real_estate_type.nil?}. #{I18n.t('real_estate.attribute.' + (is_alley ? 'alley' : 'facade'))} #{street.name unless street.nil?} #{district.name unless district.nil?} #{province.name unless province.nil?}"
  end

  # / Name

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