class Ability

  include CanCan::Ability

  def initialize user, request
    user ||= User.new

    # No Signed required
    
      # Real estate

      # Have one in signed required
      can :view, RealEstate, is_show: true, is_pending: false, is_force_hide: false

      can :create, RealEstate

      can [:edit, :delete], RealEstate do |re|
        re.user_id == 0 && (re.params['remote_ip'] == request.remote_ip || request[:secure_code] == re.params['secure_code'])
      end

      # / Real estate

    # / No Signed required


    # Signed required

      # Not sign
      if user.new_record?

        # User

          can [:signup, :signin]

        # / User

      else

        can [:signout]

        # Admin

          if user.is_admin
            can [:view, :manage, :approve, :appraise, :change_show_status, :change_force_hide_status, :change_favorite_status], RealEstate
            can [:manage, :approve, :appraise, :change_show_status, :change_force_hide_status, :change_favorite_status], Project
            can [:manage, :rename, :delete], Investor
            can :manage, User
            can [:manager, :create, :edit, :delete], AppraisalCompany
          end

        # / Admin

        # Real estate

          can :view, RealEstate, user_id: user.id

          can [:view_my], RealEstate

          can [:edit, :delete, :change_show_status], RealEstate, user_id: user.id

          if user.is_real_estate_manager
            can [:view, :manage, :approve, :appraise, :change_force_hide_status, :change_favorite_status], RealEstate
          end

        # / Real estate

        # Favorite real estate

          can :add, UsersFavoriteRealEstate
          can :remove, UsersFavoriteRealEstate, user_id: user.id

        # / Favorite real estate

        # Project
        
          can [:create, :view_my], Project

          can [:edit, :delete, :change_show_status], Project, user_id: user.id

          if user.is_project_manager
            can [:manage, :approve, :appraise, :change_force_hide_status, :change_favorite_status], Project
          end

        # / Project

        # Investor

          if user.is_project_manager
            can [:manage, :rename, :delete], Investor
          end

        # / Investor

        # User
        
          can [:edit, :cancel_change_email], User, id: user.id

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

          can [:create, :view_inbox, :view_sent, :view_draft], MailBox

          can [:read, :reply], MailBox do |m|
            m.from_id == user.id || m.to_id == user.id
          end

          can :continue, MailBox, is_draft: true, from_id: user.id

          # Sent
          can :remove_from, MailBox, from_id: user.id
          # Inbox
          can :remove_to, MailBox, to_id: user.id

          can :delete, MailBox, is_draft: true, from_id: user.id

        # / Mail box

      end

    # / Signed required

  end

end
