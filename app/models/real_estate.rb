class RealEstate < ActiveRecord::Base

  belongs_to :real_estate_type
  belongs_to :street
  belongs_to :ward
  belongs_to :district
  belongs_to :province
  belongs_to :currency
  belongs_to :purpose
  belongs_to :unit
  belongs_to :legal_record_type
  belongs_to :planning_status_type
  belongs_to :constructional_level

  has_and_belongs_to_many :property_utilities
  has_and_belongs_to_many :region_utilities
  has_and_belongs_to_many :advantages
  has_and_belongs_to_many :disadvantages
  has_and_belongs_to_many :images

  validates :title, presence: { message: 'Tiêu đề không được bỏ trống' }
  validates :description, presence: { message: 'Mô tả không được bỏ trống' }
  validates :purpose_id, presence: { message: 'Mục tiêu không được bỏ trống' }
  validates :price, presence: { message: 'Giá không được bỏ trống' }
  validates :currency_id, presence: { message: 'Loại tiền không được bỏ trống' }
  validates :unit_id, presence: { message: 'Đơn vị tính không được bỏ trống' }
  validates :province_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :district_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :ward_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :street_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :address_number, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :street_type_id, presence: { message: 'Loại đường không được bỏ trống' }
  validates :real_estate_type_id, presence: { message: 'Loại bất động sản không được bỏ trống' }
  validates :width_x, presence: { message: 'Chiều ngang không được bỏ trống' }
  validates :width_y, presence: { message: 'Chiều dài không được bỏ trống' }
  validates :shape, presence: { message: 'Hình dáng không được bỏ trống' }
  validates :legal_record_type_id, presence: { message: 'Hồ sơ không được bỏ trống' }
  validates :planning_status_type_id, presence: { message: 'Tình trạng không được bỏ trống' }

  validate :custom_validate

  def custom_validate
    fields = []

    fields << :alley_width if is_alley == 1
    fields << :shape_width if shape != '0'
    fields << :custom_legal_record_type if legal_record_type_id == 0
    fields << :custom_planning_status_type if planning_status_type_id == 0
    fields |= RealEstate.get_real_estate_type_fields(real_estate_type_id)

    errors.add(:alley_width, 'Kích thước hẻm không được bỏ trống') if fields.include? :alley_width && alley_width == 0
    errors.add(:shape_width, 'Kích thước hình dáng không được bỏ trống') if fields.include?(:shape_width) && shape_width == 0
    errors.add(:custom_legal_record_type, 'Loại hồ sơ không được bỏ trống') if fields.include?(:custom_legal_record_type) && custom_legal_record_type.blank?
    errors.add(:custom_planning_status_type, 'Tình trạng quy hoạch không được bỏ trống') if fields.include?(:custom_planning_status_type) && custom_planning_status_type.blank?
    errors.add(:campus_area, 'Diện tích khuôn viên không được bỏ trống') if fields.include?(:campus_area) && campus_area == 0
    errors.add(:using_area, 'Diện tích sử dụng không được bỏ trống') if fields.include?(:using_area) && using_area == 0
    errors.add(:direction_id, 'Kích thước hẻm không được bỏ trống') if fields.include? :direction_id
    errors.add(:constructional_level, 'Diện tích xây dựng không được bỏ trống') if fields.include?(:constructional_area) && constructional_area == 0
    errors.add(:constructional_quality, 'Chất lượng còn lại không được bỏ trống') if fields.include?(:constructional_quality) && constructional_quality == 0
  end

  # save real-estate params
  def self.save_real_estate params
    # save data
    real_estate_params = get_real_estate_params params
    if params.include? :id
      real_estate = find params[:id]
      real_estate.update real_estate_params
    else
      real_estate = RealEstate.new real_estate_params
    end
    real_estate.advantages << Advantage.find(params[:advantage_ids]) if params.include? :advantage_ids
    real_estate.disadvantages << Disadvantage.find(params[:disadvantage_ids]) if params.include? :disadvantage_ids
    real_estate.property_utilities << PropertyUtility.find(params[:property_utility_ids]) if params.include? :property_utility_ids
    real_estate.region_utilities << RegionUtility.find(params[:region_utility_ids]) if params.include? :region_utility_ids
    real_estate.images << Image.find(params[:image_ids].to_a - ['']) if params.include? :image_ids
    real_estate.name = get_real_estate_name real_estate_params

    real_estate.save
    real_estate
  end

  def self.get_real_estate_name real_estate_params
    RealEstateType.find(real_estate_params['real_estate_type_id']).name + ' - ' +
        real_estate_params['is_alley'] == '1' ? 'Hẻm' : 'Mặt tiền' + ' - ' +
        Street.find(real_estate_params['street_id']).name + ' - ' +
        District.find(real_estate_params['district_id']).name + ' - ' +
        Province.find(real_estate_params['province_id']).name
  end

  # get real-estate params
  def self.get_real_estate_params real_estate_params
    # price
    # Chuyển sang số
    real_estate_params['price'] = real_estate_params[:no_price] == '1' ? 0 : ApplicationHelper.to_i(real_estate_params['price'])

    # unit
    # Kiểm tra xem mục đích là gì để xác định unit
    temp = Purpose.find(real_estate_params['purpose_id'])
    real_estate_params['unit_id'] = real_estate_params[temp.code == 'Ban' ? 'unit_id_sell' : 'unit_id_rent']

    # alley_width
    # Chuyển sang số
    real_estate_params['alley_width'] = ApplicationHelper.to_i real_estate_params['alley_width']

    # real_estate_type
    case real_estate_params['real_estate_type_group']
      when 'Dat'
        temp = 'dat'
      when 'Nha'
        temp = 'nha'
      when 'CanHo'
        temp = 'can_ho'
      when 'MatBang'
        temp = 'mat_bang'
    end
    real_estate_params['real_estate_type_id'] = real_estate_params["real_estate_type_id_#{temp}"]

    # constructional_area
    # Chuyển sang dạng số
    real_estate_params['constructional_area'] = ApplicationHelper.to_f real_estate_params['constructional_area']

    # using_area
    # Chuyển sang dạng số
    real_estate_params['using_area'] = ApplicationHelper.to_f real_estate_params['using_area']

    # campus_area
    # Chuyển sang dạng số
    real_estate_params['campus_area'] = ApplicationHelper.to_f real_estate_params['campus_area']

    # constructional_quality
    # Chuyển sang dạng số
    real_estate_params['constructional_quality'] = ApplicationHelper.to_i real_estate_params['constructional_quality']


    # title, description, name, purpose_id, price,
    # currency_id, unit_id, is_negotiable, province_id, district_id
    # ward_id, street_id, address_number, street_type_id, is_alley
    # #alley_size, real_estate_type_id, #campus_area, #using_area,
    # #floor_number, #restroom_number, #bedroom_number, #direction_id
    # #build_year, #constructional_quality, #constructional_area,
    # #constructional_level_id, width_x, width_y, shape, #shape_width,
    # legal_record_type_id, #custom_legal_record_type, planning_status_type_id,
    # #custom_planning_status_type, custom_advantages, custom_disadvantages,
    # is_show, expired_time, ads_cost, is_paid, options

    fields = [
      :title, :description, :name, :purpose_id, :price, :currency_id, :unit_id,
      :is_negotiable, :province_id, :district_id, :ward_id, :street_id, :address_number,
      :street_type_id, :is_alley, :real_estate_type_id, :width_x, :width_y, :shape,
      :legal_record_type_id, :planning_status_type_id, :custom_advantages, :custom_disadvantages
    ]

    fields << :alley_width if real_estate_params[:is_alley] == '1'
    fields << :shape_width if real_estate_params[:shape] != '0'
    fields << :custom_legal_record_type if real_estate_params[:legal_record_type_id] == '0'
    fields << :custom_planning_status_type if real_estate_params[:planning_status_type_id] == '0'
    fields << :advantage_ids# if real_estate_params.include?(:advantage_ids) && real_estate_params[:advantage_ids].any?
    fields << :disadvantage_ids# if real_estate_params.include?(:disadvantage_ids) && real_estate_params[:disadvantage_ids].any?
    fields << :property_utility_ids# if real_estate_params.include?(:property_utility_ids) && real_estate_params[:property_utility_ids].any?
    fields << :region_utility_ids# if real_estate_params.include?(:region_utility_ids) && real_estate_params[:region_utility_ids].any?
    fields << :image_ids# if real_estate_params.include?(:image_ids) && real_estate_params[:image_ids].any?

    # real_estate_type
    fields |= get_real_estate_type_fields(real_estate_params[:real_estate_type_id])

    real_estate_params.permit(fields)
  end

  # get fields by real-estate type
  def self.get_real_estate_type_fields real_estate_type_id
    fields = []

    real_estate_type = RealEstateType.find real_estate_type_id

    case real_estate_type.options_hash['group']
      when 'Dat'
        fields << :campus_area
      when 'MatBang', 'Nha'
        fields << :campus_area << :using_area << :constructional_area << :restroom_number <<
            :bedroom_number << :build_year << :constructional_level_id << :constructional_quality << :direction_id
        if real_estate_type.options_hash['group'] == 'Nha'
          fields << :floor_number
          if real_estate_type.code == 'BietThu'
              fields.delete :constructional_level_id
          end
        end
      when 'CanHo'
        fields << :using_area << :floor_number << :bedroom_number << :restroom_number <<
            :build_year << :constructional_quality << :direction_id
        if real_estate_type.code == 'ChungCu'
          fields << :constructional_level_id
        end
    end

    fields
  end
end