class Ability
  include CanCan::Ability

  def initialize user
    # Not sign
    if user.new_record?

# User

      can [:signup, :signin]

# /User

    else

      can [:signout]

# Real estate

      can [:create, :view_my], RealEstate

      can :edit, RealEstate

      if user.is_real_estate_manager
        can [:manage, :approve, :edit], RealEstate
      end

# / Real estate

# User

      if user.is_user_manager
        can :manage, User
      end

# / User

    end
  end
end
