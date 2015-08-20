class Ability

  include CanCan::Ability

  def initialize user
    user ||= User.new

    # Not sign
    if user.new_record?

# User

      can [:signup, :signin]

# /User

    else

      can [:signout]

      if user.is_admin
        can [:manage, :approve, :appraise, :edit], RealEstate
        can :manage, User
        can [:manager, :create, :edit, :delete], AppraisalCompany
      end

# Real estate

      can [:create, :view_my], RealEstate

      can [:edit, :delete], RealEstate, user_id: user.id

      if user.is_real_estate_manager
        can [:manage, :approve, :appraise, :edit], RealEstate
      end

# / Real estate

# User
      
      can :edit, User, id: user.id

      if user.is_user_manager
        can [:manage, :edit], User
      end

# / User

# Appraisal company

      if user.is_appraiser
        can [:manager, :create, :edit, :delete], AppraisalCompany
      end

# / Appraisal company

    end
  end
end
