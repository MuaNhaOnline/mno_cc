class RealEstate < ActiveRecord::Base

  # Associates

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

  has_and_belongs_to_many :property_utilities
  has_and_belongs_to_many :region_utilities
  has_and_belongs_to_many :advantages
  has_and_belongs_to_many :disadvantages
  has_and_belongs_to_many :images

  # / Associates

  # Validates

  validates :title, presence: { message: 'Tiêu đề không được bỏ trống' }
  validates :description, presence: { message: 'Mô tả không được bỏ trống' }
  validates :purpose_id, presence: { message: 'Mục tiêu không được bỏ trống' }
  validates :currency_id, presence: { message: 'Loại tiền không được bỏ trống' }
  validates :province_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :district_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :ward_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :street_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :street_type_id, presence: { message: 'Loại đường không được bỏ trống' }
  validates :real_estate_type_id, presence: { message: 'Loại bất động sản không được bỏ trống' }
  validates :width_x, presence: { message: 'Chiều ngang không được bỏ trống' }
  validates :width_y, presence: { message: 'Chiều dài không được bỏ trống' }

  validate :custom_validate

  def custom_validate
    fields = []

    real_estate_type = RealEstateType.find real_estate_type_id
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
    fields << :alley_width if is_alley == 1
    fields << :shape_width if fields.include?(:shape) && shape != 0
    fields << :custom_legal_record_type if legal_record_type_id == 0
    fields << :custom_planning_status_type if planning_status_type_id == 0

    # if sell
    if purpose.code === 'sell' || purpose.code === 'sell_rent'
      errors.add(:legal_record_type_id, 'Hồ sơ không được bỏ trống') if legal_record_type_id.blank?
      errors.add(:planning_status_type_id, 'Tình trạng không được bỏ trống') if planning_status_type_id.blank?
    end

    errors.add(:alley_width, 'Kích thước hẻm không được bỏ trống') if fields.include?(:alley_width) && alley_width.blank?
    errors.add(:shape, 'Hình dáng không được bỏ trống') if fields.include?(:shape) && shape.blank?
    errors.add(:shape_width, 'Kích thước hình dáng không được bỏ trống') if fields.include?(:shape_width) && shape_width.blank?
    errors.add(:custom_legal_record_type, 'Loại hồ sơ không được bỏ trống') if fields.include?(:custom_legal_record_type) && custom_legal_record_type.blank?
    errors.add(:custom_planning_status_type, 'Tình trạng quy hoạch không được bỏ trống') if fields.include?(:custom_planning_status_type) && custom_planning_status_type.blank?
    errors.add(:campus_area, 'Diện tích khuôn viên không được bỏ trống') if fields.include?(:campus_area) && campus_area.blank?
    errors.add(:using_area, 'Diện tích sử dụng không được bỏ trống') if fields.include?(:using_area) && using_area .blank?
    errors.add(:constructional_level, 'Diện tích xây dựng không được bỏ trống') if fields.include?(:constructional_area) && constructional_area.blank?
    errors.add(:constructional_quality, 'Chất lượng còn lại không được bỏ trống') if fields.include?(:constructional_quality) && constructional_quality.blank?
    errors.add(:images, 'Có tối thiểu 1 hình ảnh') if !id.blank? && images.length == 0
  end

  # / Validates

  # Name

  def name
    purpose.name + ' ' +
      real_estate_type.name + ' ' +
      (is_alley == 1 ? 'Hẻm' : 'Mặt tiền') + ' ' +
      street.name + ' ' +
      'Quận ' + district.name + ' ' +
      province.name + ' ' +
      (legal_record_type.code != 'Custom' ? legal_record_type.name : custom_legal_record_type)
  end

  # / Name

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
    params[:constructional_quality] = ApplicationHelper.format_i params[:constructional_quality] if params.has_key? :constructional_quality

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
    params[:image_ids] = params[:image_ids].blank? ? [] : params[:image_ids].split(',')

    # Get field

    fields = [
      :title, :description, :purpose_id, :sell_price, :rent_price, :currency_id, :sell_unit_id,
      :rent_unit_id, :is_negotiable, :province_id, :district_id, :ward_id, :street_id, 
      :address_number, :street_type_id, :is_alley, :real_estate_type_id, :width_x, :width_y,
      :legal_record_type_id, :planning_status_type_id, :custom_advantages, :custom_disadvantages,
      :alley_width, :shape_width, :custom_legal_record_type, :custom_planning_status_type, :is_draft,
      :lat, :long,  
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

  # Assign with params

  def assign_with_params params
    real_estate_params = RealEstate.get_params params

    assign_attributes(real_estate_params)
  end

  # / Assign with params

  # Save with params

  def save_with_params params, is_draft = false
    params[:is_draft] = is_draft ? 1 : 0
    assign_with_params params

    save validate: !is_draft
  end

  # / Save with params


# Temp
  def self.update_show_status id, is_show
    real_estate = find id

    real_estate.is_show = is_show

    real_estate.save validate: false
  end

  #Get keyword
  def keyword
    legal = legal_record_type_id == 0 ? legal_record_type.name : custom_legal_record_type
    alley = is_alley == 1 ? 'Hẻm' : 'Mặt tiền'

    keyword =  
      "#{name}, #{purpose.name} #{real_estate_type.name} quận #{district.name}, #{real_estate_type.name} #{legal}, #{real_estate_type.name} #{alley}, #{alley} quận #{district.name}, #{street.name} quận #{district.name}, #{purpose.name}, #{province.name}, #{real_estate_type.name}, #{legal}"
  end

  #endregion
# / Temp

end