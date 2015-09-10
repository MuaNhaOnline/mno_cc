class Ability

  include CanCan::Ability

  def initialize user, request
    user ||= User.new
    
    can :create, RealEstate
    can [:edit, :delete], RealEstate do |re|
      re.user_id == 0 && (re.params['remote_ip'] == request.remote_ip || request[:secure_code] == re.params['secure_code'])
    end

    # Not sign
    if user.new_record?

# User

      can [:signup, :signin]

# / User

# Admin

    else

      can [:signout]

      if user.is_admin
        can [:manage, :approve, :appraise, :change_show_status], RealEstate
        can [:manage, :approve, :appraise, :change_show_status], Project
        can [:manage, :rename, :delete], Investor
        can :manage, User
        can [:manager, :create, :edit, :delete], AppraisalCompany
      end

# / Admin

# Real estate

      can [:view_my], RealEstate

      can [:edit, :delete, :change_show_status], RealEstate, user_id: user.id

      if user.is_real_estate_manager
        can [:manage, :approve, :appraise, :edit], RealEstate
      end

# / Real estate

# Project
      
      can [:create, :view_my], Project

      can [:edit, :delete, :change_show_status], Project, user_id: user.id

      if user.is_project_manager
        can [:manage, :approve, :appraise, :edit], Project
      end

# / Project

# Investor

      if user.is_project_manager
        can [:manage, :rename, :delete], Investor
      end

# / Investor

# User
      
      can :edit, User, id: user.id

      if user.is_user_manager
        can [:manage], User
      end

# / User

# Appraisal company

      ac = AppraisalCompany.current

      unless ac.nil?
        can :view_assigned_list, AppraisalCompany

        can :update_appraisal_price, RealEstate, appraisal_companies_real_estates: {
          appraisal_company_id: ac.id,
          is_assigned: true
        }
      end

      if user.is_appraiser
        can [:manager, :create, :edit, :delete], AppraisalCompany
      end

# / Appraisal company

# Mail box

      can [:create, :view_inbox], MailBox

      can [:read, :reply], MailBox do |m|
        m.from_id === user.id || m.to_id === user.id
      end

      can :remove_from, MailBox
      can :remove_to, MailBox

# / Mail box

    end
  end

end
