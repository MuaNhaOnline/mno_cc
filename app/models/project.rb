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

  def name
    ProjectType.find(project_type_id).name + ' ' +
        'Quận ' + District.find(district_id).name
  end

  #region Save project

  def self.save_project params, is_draft = false
    project = create_project params

    project.is_draft = is_draft ? 1 : 0

    project.save validate: !is_draft

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

  #region Update project

  def self.update_project params, is_draft = false
    project_params = get_project_params params

    project = find params[:id]
    project.update project_params
    project.images = Image.find(params[:image_ids].to_a - [''])
    project.is_draft = is_draft ? 1 : 0

    project.save validate: !is_draft
    
    project
  end

  def self.update_show_status id, is_show
    project = find id

    project.is_show = is_show

    project.save validate: false
  end

  #endregion

  #region Helper

  #Get project params
  def self.get_project_params params
    params['campus_area'] = ApplicationHelper.to_f params['campus_area']
    params['width_x'] = ApplicationHelper.to_f params['width_x']
    params['width_y'] = ApplicationHelper.to_f params['width_y']
    params['using_ratio'] = ApplicationHelper.to_f params['using_ratio']
    params['unit_price'] = ApplicationHelper.to_i params['unit_price']

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
end