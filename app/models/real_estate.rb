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

  def self.get_options_before_create
    Hash[
      'advantages' => Advantage.all,\
      'constructional_levels' => ConstructionalLevel.all,\
      'currencies' => Currency.all,\
      'directions' => Direction.all,\
      'disadvantages' => Disadvantage.all,\
      'legal_record_types' => LegalRecordType.all,\
      'planning_status_types' => PlanningStatusType.all,\
      'purposes' => Purpose.all,\
      'real_estate_types' => RealEstateType.all,\
      'property_utilities' => PropertyUtility.all,\
      'region_utilities' => RegionUtility.all,\
      'street_types' => StreetType.all,\
      'units' => Unit.all\
    ]
  end

  def self.save_real_estate real_estate_params
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
    # #floor_number, #restroom_number, #bedroom_number, direction_id
    # #build_year, #constructional_quality, #constructional_area,
    # #constructional_level_id, width_x, width_y, shape, #shape_width,
    # legal_record_type_id, #custom_legal_record_type, planning_status_type_id,
    # #custom_planning_status_type, custom_advantages, custom_disadvantages,
    # is_show, expired_time, ads_cost, is_paid, options

    fields = [
        :title, :description, :name, :purpose_id, :price, :currency_id, :unit_id,
        :is_negotiable, :province_id, :district_id, :ward_id, :street_id, :address_number,
        :street_type_id, :is_alley, :real_estate_type_id, :direction_id, :width_x, :width_y, :shape,
        :legal_record_type_id, :planning_status_type_id, :custom_advantages, :custom_disadvantages]

    # alley_size
    if real_estate_params[:is_alley] == '1'
      fields << :alley_width
    end

    # real_estate_type
    fields |= get_real_estate_type_fields(real_estate_params[:real_estate_type_id])

    # shape_width
    fields << :shape_width if real_estate_params[:shape] != '0'

    # custom_legal_record_type
    if real_estate_params[:legal_record_type_id] == '0'
      fields << :custom_legal_record_type
    end

    # custom_planning_status_type
    if real_estate_params[:planning_status_type_id] == '0'
      fields << :custom_planning_status_type
    end

    # save data
    real_estate = RealEstate.new real_estate_params.permit(fields)
    real_estate.advantages << Advantage.find(real_estate_params[:advantage_ids]) if real_estate_params.include? :advantages_ids
    real_estate.disadvantages << Disadvantage.find(real_estate_params[:disadvantage_ids]) if real_estate_params.include? :disadvantage_ids
    real_estate.property_utilities << PropertyUtility.find(real_estate_params[:property_utility_ids]) if real_estate_params.include? :property_utility_ids
    real_estate.region_utilities << RegionUtility.find(real_estate_params[:region_utility_ids]) if real_estate_params.include? :region_utility_ids

    real_estate.name = RealEstateType.find(real_estate_params[:real_estate_type_id]).name + '...'

    real_estate.save
    real_estate
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
            :bedroom_number << :build_year << :constructional_level_id << :constructional_quality
        if real_estate_type.options_hash['group'] == 'Nha'
          fields << :floor_number
          if real_estate_type.code == 'BietThu'
              fields.delete :constructional_level_id
          end
        end
      when 'CanHo'
        fields << :using_area << :floor_number << :bedroom_number << :restroom_number <<
            :build_year << :constructional_quality
        if real_estate_type.code == 'ChungCu'
          fields << :constructional_level_id
        end
    end

    fields
  end
end