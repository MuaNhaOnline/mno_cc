class AppraisalCompaniesRealEstate < ActiveRecord::Base
	default_scope { order assigned_time: :desc }

 	belongs_to :appraisal_company
  belongs_to :real_estate



# Update

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

  def self.update_price params
    # Get real_estate
    re = RealEstate.find params[:real_estate_id]
    return { status: 1 } if re.nil?

    # Author
    return { status: 6 } if User.current.cannot? :update_appraisal_price, re

    # Update price
    ac = AppraisalCompany.current
    ac_re = where(real_estate_id: re.id, appraisal_company_id: ac.id).first
    ac_re.sell_price = ApplicationHelper.format_i(params[:sell_price]) if params.has_key? :sell_price
    ac_re.rent_price = ApplicationHelper.format_i(params[:rent_price]) if params.has_key? :rent_price

    if ac_re.save
      { status: 0 }
    else
      { status: 3 }
    end
  end

# / Update
end
