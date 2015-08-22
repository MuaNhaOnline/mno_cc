class AppraisalCompaniesRealEstate < ActiveRecord::Base
	default_scope { order assigned_time: :desc }

 	belongs_to :appraisal_company
  belongs_to :real_estate

  # Set appraisal company
  def self.assign re_id, ac_id

    # 1st: unassigned all assign before
    where(real_estate_id: re_id).update_all(is_assigned: false)

    # 2nd: insert new assign or re-assign if existed

    unless ac_id.blank?
      ac_re = where(real_estate_id: re_id, appraisal_company_id: ac_id).first_or_initialize

      ac_re.is_assigned = true
      ac_re.assigned_time = Time.now

      if ac_re.save
      	{ status: 0 }
      else
      	{ status: 3 }
      end
    else
      { status: 0 }
    end
  end
end
