class Ability

	include CanCan::Ability

	def initialize user, request
		user ||= User.new

		# General

			# User
			
				if user.new_record?
					can :login
				else
					can :logout
				end
			
			# / User
			
			# Real estate
			
				can :view, RealEstate, is_pending: false, is_show: true, is_force_hide: false
				can :create, RealEstate
				can [:view, :edit, :delete], RealEstate do |re|
					re.user_type == 'contact_user' && request[:secure_code] == re.params['secure_code']
				end
			
			# / Real estate

			# Project
			
				can :view, Project, is_pending: false, is_show: true, is_force_hide: false
			
			# / Project
		
		# / General

		return if user.new_record?

		# Sign in required

			can [:view_my, :set_my], :all

			# Real estate
			
				can [:view, :edit, :delete], RealEstate, user_type: 'user', user_id: user.id

			# / Real estate

			# Real estate favorite
			
				can :create, UsersFavoriteRealEstate
				can :delete, UsersFavoriteRealEstate, user_id: user.id
			
			# / Real estate favorite

		# / Sign in required

		# With permission

			# System group
			
				if user.system_permission_values.has_key? :sys_general
					can :manage, SystemGroup if user.system_permission_values[:sys_general].include? 'manage_group'
				end
			
			# / System group
		
			# Real estate

				if user.system_permission_values.has_key? :sys_re
					can :manage, RealEstate if user.system_permission_values[:sys_re].include? 'manage'
				end
			
			# / Real estate

			# Project
			
				can [:create, :edit, :delete], Project do |project|
					project.new_record? || user.represented_investors.exists?(id: project.investor_id)
				end if user.represented_investors.present?

				if user.system_permission_values.has_key? :sys_pj
					can :manage, Project if user.system_permission_values[:sys_pj].include? 'manage'
				end
			
			# / Project
		
		# / With permission

	end

end
