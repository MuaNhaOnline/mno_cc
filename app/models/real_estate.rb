class RealEstate < ActiveRecord::Base

  def self.getOptionsBeforeCreate
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
      'real_estate_utilities' => RealEstateUtility.all,\
      'region_utilities' => RegionUtility.all,\
      'street_types' => StreetType.all,\
      'units' => Unit.all\
    ]
  end

  def self.saveRealEstate realEstate
    # price
    # Chuyển sang số
    realEstate['price'] = realEstate[:no_price] == '1' ? 0 : ApplicationHelper.to_i(realEstate['price'])

    # unit
    # Kiểm tra xem mục đích là gì để xác định unit
    temp = Purpose.find(realEstate['purpose_id'])
    realEstate['unit_id'] = realEstate['unit_id_' + temp.code == 'Ban' ? 'sell' : 'rent']

    # alley_size
    # Chuyển sang số
    realEstate['alley_size'] = ApplicationHelper.to_i realEstate['alley_size']

    # real_estate_type
    case realEstate['real_estate_type_group']
      when 'Dat'
        temp = 'dat'
      when 'Nha'
        temp = 'nha'
      when 'CanHo'
        temp = 'can_ho'
      when 'MatBang'
        temp = 'mat_bang'
    end
    realEstate['real_estate_type_id'] = realEstate["real_estate_type_id_#{temp}"]

    # constructional_area
    # Chuyển sang dạng số
    realEstate['constructional_area'] = ApplicationHelper.to_f realEstate['constructional_area']

    # using_area
    # Chuyển sang dạng số
    realEstate['using_area'] = ApplicationHelper.to_f realEstate['using_area']

    # campus_area
    # Chuyển sang dạng số
    realEstate['campus_area'] = ApplicationHelper.to_f realEstate['campus_area']

    # constructional_quality
    # Chuyển sang dạng số
    realEstate['constructional_quality'] = ApplicationHelper.to_i realEstate['constructional_quality']


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
        :legel_record_type_id, :planning_status_type_id, :custom_advantages, :custom_disadvantages]

    # alley_size
    if realEstate[:is_alley] != '1'
      fields << :alley_size
    end

    # real_estate_type
    temp = RealEstateType.find realEstate[:real_estate_type_id]
    case temp.options['group']
      when 'Dat'
        fields << :campus_area
      when 'MatBang', 'Nha'
        fields <<
            [:campus_area, :using_area, :constructional_area, :restroom_number, :bedroom_number,
            :build_year, :constructional_level_id, :constructional_quality]
        if temp.options[:group] == 'Nha'
          fields << :floor_number
          if temp.code == 'BietThu'
            fields >> :constructional_level_id
          end
        end
      when 'CanHo'
        fields <<
            [:using_area, :floor_number, :bedroom_number, :restroom_number, :build_year, :constructional_quality]
        if temp.code == 'ChungCu'
          fields << :constructional_level_id
        end
    end

    # shape_width
    fields << :shape_width if realEstate[:shape] != 0

    # custom_legal_record_type
    if realEstate[:legel_record_tpye_id] == 0
      fields << :custom_legal_record
    end

    # custom_planning_status_type
    if realEstate[:planning_status_type_id] == 0
      fields << :custom_planning_status_type
    end

    RealEstate.create realEstate.permit(fields)
  end

end