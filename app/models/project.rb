class Project < ActiveRecord::Base

  #region Associate

  belongs_to :project_type
  belongs_to :street
  belongs_to :ward
  belongs_to :district
  belongs_to :province
  belongs_to :currency
  belongs_to :investor

  has_and_belongs_to_many :images

  #endregion

  #region Validates

  validates :title, presence: { message: 'Tiêu đề không được bỏ trống' }
  validates :description, presence: { message: 'Mô tả không được bỏ trống' }
  validates :province_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :district_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :ward_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :street_id, presence: { message: 'Địa chỉ không được bỏ trống' }
  validates :campus_area, presence: { message: 'Diện tích khuôn viên không được bỏ trống' }
  validates :width_x, presence: { message: 'Chiều ngang không được bỏ trống' }
  validates :width_y, presence: { message: 'Chiều dài không được bỏ trống' }
  validates :estimate_starting_date, presence: { message: 'Ngày khởi công dự kiến không được bỏ trống' }
  validates :estimate_finishing_date, presence: { message: 'Ngày kết thúc dự kiến không được bỏ trống' }
  validates :starting_date, presence: { message: 'Ngày khởi công không được bỏ trống' }
  validates :finished_base_date, presence: { message: 'Ngày hoàn thành móng không được bỏ trống' }
  validates :transfer_date, presence: { message: 'Ngày bàn giao nhà không được bỏ trống' }
  validates :docs_issue_date, presence: { message: 'Ngày cấp sổ không được bỏ tr' }
  validates :unit_price, presence: { message: 'Đơn giá không được bỏ trống' }

  validate :custom_validate

  def custom_validate
    errors.add(:images, 'Có tối thiểu 1 hình ảnh') if images.length == 0
  end

  #endregion

  #region Save project

  def self.save_project params
    project = create_project params

    project.save

    project
  end

  #Create new project
  def self.create_project params
    project_params = get_project_params params

    project = new project_params

    project.images = Image.find(params[:image_ids].to_a - ['']) if params.include? :image_ids

    project
  end

  #endregion

  #region Helper

  #Get project params
  def self.get_project_params params
    fields = [
        :title, :description, :province_id, :district_id, :ward_id, :street_id, :address_number,
        :project_type_id, :campus_area, :width_x, :width_y, :using_ratio, :estimate_starting_date,
        :estimate_finishing_date, :starting_date, :finished_base_date, :transfer_date, :docs_issue_date,
        :investor_id, :execute_unit, :design_unit, :manage_unit, :unit_price, :currency_id,
        :payment_method
    ]

    params.permit fields
  end

  #endregion

  # #region Update real-estate
  #
  # def self.update_real_estate params, is_draft = false
  #   real_estate_params = get_real_estate_params params
  #
  #   real_estate = find params[:id]
  #   real_estate.update real_estate_params
  #   real_estate.advantages = params.include?(:advantage_ids) ? Advantage.find(params[:advantage_ids]) : []
  #   real_estate.disadvantages = params.include?(:disadvantage_ids) ? Disadvantage.find(params[:disadvantage_ids]) : []
  #   real_estate.property_utilities = params.include?(:property_utility_ids) ? PropertyUtility.find(params[:property_utility_ids]) : []
  #   real_estate.region_utilities = params.include?(:region_utility_ids) ? RegionUtility.find(params[:region_utility_ids]) : []
  #   real_estate.images = params.include?(:image_ids) ? Image.find(params[:image_ids].to_a - ['']) : []
  #   real_estate.name = get_real_estate_name(real_estate_params)
  #   real_estate.is_draft = is_draft ? 1 : 0
  #
  #   real_estate.save validate: !is_draft
  #
  #   real_estate
  # end
  #
  # def self.update_show_status id, is_show
  #   real_estate = find id
  #   real_estate.update is_show: is_show
  # end
  #
  # #endregion

end