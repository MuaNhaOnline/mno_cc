class Project < ActiveRecord::Base

  include PgSearch
  pg_search_scope :search, against: [:meta_search]

# Associates

  belongs_to :user
  belongs_to :project_type
  belongs_to :street
  belongs_to :ward
  belongs_to :district
  belongs_to :province
  belongs_to :currency
  belongs_to :investor

  has_and_belongs_to_many :images

# / Associates

# Validates

  validates :title, presence: { message: 'Tiêu đề không được bỏ trống' }
  validates :description, presence: { message: 'Mô tả không được bỏ trống' }
  validates :province_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :district_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :street_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :campus_area, presence: { message: 'Diện tích khuôn viên không được bỏ trống' }
  validates :date_display_type, presence: { message: 'Cách hiển thị không được bỏ trống' }

  validate :custom_validate

  def custom_validate
    errors.add(:images, 'Có tối thiểu 1 hình ảnh') if images.length == 0
  end

# / Validates

# Insert

  # Get params

  def self.get_params params
    # Get price
    params[:unit_price] = ApplicationHelper.format_i(params[:unit_price]) if params.has_key? :unit_price

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
      investor = Investor.find_by_name params[:investor_id_ac]
      investor = Investor.create(name: params[:investor_id_ac]) if investor.nil?
      params[:investor_id] = investor.id
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

    # Images 
    params[:image_ids] = params[:image_ids].blank? ? [] : params[:image_ids].split(',').take(10) if params.has_key? :image_ids

    # Get field

    fields = [
      :title, :description, :unit_price, :currency_id, :payment_method,
      :lat, :long, :address_number, :province_id, :district_id, :ward_id, :street_id, 
      :project_type_id, :campus_area, :width_x, :width_y, :is_draft,
      :using_ratio, :estimate_starting_date, :estimate_finishing_date,
      :starting_date, :finished_base_date, :transfer_date, :docs_issue_date,
      :investor_id, :execute_unit, :design_unit, :manage_unit, :user_id, :date_display_type,
      :image_ids => []
    ]

    # / Get fields

    params.permit fields
  end

  # Save with params

  def save_with_params params, is_draft = false
    # Author
    if new_record?
      return { status: 6 } if User.current.cannot? :create, Project
    else
      return { status: 6 } if User.current.cannot? :edit, self
    end

    project_params = Project.get_params params

    assign_attributes project_params

    other_params = {
      is_draft: is_draft,
      is_pending: true,
      meta_search: Project.get_meta_search(self)
    }

    assign_attributes other_params

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

  # Get pending

  def self.get_pending
    where(is_pending: true, is_draft: false)
  end

  # / Get pending

# / Get

# Helper

  # Get fields

  def self.get_fields p
    []
  end

  # / Get fields

  # Get meta search

  def self.get_meta_search p
    tempLocale = I18n.locale
    I18n.locale = 'vi'

    meta_search = "#{p.investor.name unless p.investor.nil?} #{I18n.t('project_type.text.' + p.project_type.name) unless p.project_type.nil?} đường #{p.street.name unless p.street.nil?} quận #{p.district.name unless p.district.nil?} #{p.province.name unless p.province.nil?} #{p.title}"
    
    I18n.locale = tempLocale

    meta_search
  end

  # / Get meta search

# / Helper
end