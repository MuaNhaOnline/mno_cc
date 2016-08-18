class UsersController < ApplicationController
	layout 'layout_back'

	# Register
		
		# View
		def create
			if params[:id].blank? && User.signed?
				params[:id] = User.current.id
			end

			@user = params[:id].present? ? User.find(params[:id]) : User.new
			
			# Author
			if @user.new_record?
				authorize! :create, nil
			else  
				authorize! :edit, @user
			end
		end

		# Handle
		# params: form user
		def save
			# Get user
			if is_new = params[:user][:id].blank?
				user = User.new

				if params[:contact_id].present?
					# Get contact data if get from contact
					contact = ContactUserInfo.find params[:contact_id]

					params[:user][:email] = contact.email
					params[:user][:phone_number] = contact.phone_number
				else
					# Check if current email, phone_number was used by contact
					same_contact = ContactUserInfo.where("phone_number ~ '(\\y|,){1}(#{params[:user][:phone_number]})(\\y|,){1}' OR email = '#{params[:user][:email]}'").first
					if same_contact.present?
						return render json: {
							status: 5,
							result: {
								same_contact: same_contact.to_json(only: [:id]),
								html: render_to_string(partial: 'contact_user_infos/same_contact', locals: { code: 'contact_user', same_contact: same_contact })
							}
						}
					end
				end
			else 
				user = User.find(params[:user][:id])
			end

			result = user.save_with_params params[:user]
			
			# If error
			return render json: result if result[:status] != 0

			# If signup
			if is_new
				# session_info = SessionInfo.find session[:session_info_id]
				# session_info.leave_infos ||= []
				# session_info.leave_infos << ['user', user.id]
				# session_info.save

				# Log
				Log.create(
					object_type: 'user',
					object_id: user.id,
					action: 'create'
				)
				
				# Delete contact
				if contact.present?
					contact.update is_deleted: true
				end
			end

			# Send active mail
			case user.active_status
			when 1
				UserMailer.active_account(user).deliver_now
			when 2
				UserMailer.active_old_email(user).deliver_now
			end

			render json: { status: 0, result: user.id, email_changed: result[:email_changed] }
		end

		# Handle
		# params: account(*)
		def check_unique_account
			render json: { status: 0, result: !User.exists?(account: params[:account]) }
		end

		# Handle
		# params: email(*)
		def check_unique_email
			render json: { status: 0, result: !User.exists?(email: params[:email]) }
		end

	# / Register

	# Active account

		# View
		# params: id(*)
		def active_callout
			begin
				@user = User.find params[:id]
				@status = params[:status]
			rescue 
				redirect_to '/'
			end
		end

		# View
		# params: id(*), code(*)
		def active_account
			result = User.active_account params[:id], params[:code]

			if result[:status] != 0
				return redirect_to '/?' + result[:status].to_s
			end

			case @status = result[:result]
				when 0, 1
					session[:recently_active_id] = params[:id]
				when 2
					@user = result[:user]
					UserMailer.active_new_email(@user).deliver_now
			end
		end

		# Handle redirect to view
		# params: id(*)
		def resend_active_account
			user = User.find params[:id]

			return redirect_to '/' if user.nil?

			# Check whether unactive user
			return redirect_to '/' if user.active_status == 0

			# Send active mail
			case user.active_status
				when 1
					UserMailer.active_account(user).deliver_now
				when 2
					UserMailer.active_old_email(user).deliver_now
				when 3
					UserMailer.active_new_email(user).deliver_now
			end

			redirect_to "/users/active_callout/#{user.id}?status=resend"
		end

		# Handle redirect to view
		# params: remember
		def active_account_signin
			# Store id into session
			session[:user_id] = session[:recently_active_id]
			session.delete :recently_active_id

			# Store account, password into cookie
			if params.has_key? :remember
				user = User.find session[:user_id]
				
				expires = 15.days.from_now
				cookies[:user_account] = {
					value: user.account,
					expires: expires
				}
				cookies[:user_password] = {
					value: user.password,
					expires: expires
				}
			else
				cookies.delete :user_account
				cookies.delete :user_password
			end

			redirect_to '/'
		end

	# / Active account

	# Sign in, out

		# View
		def signin
			# Author
			authorize! :login, nil
		end

		# Handle
		# params: user form: account(*), password(*), remember
		# return:
		#   error status 
		#     1: id is not exist
		#     2: password is not correct
		#     3: unactive account
		def signin_handle
			result = User.check_signin params[:user][:account], params[:user][:password]

			# Return if not correct
			if result[:status] != 0
				return respond_to do |format|
					format.html { render '/users/signin' }
					format.json { render json: result }
				end if result[:status] == 6

				return respond_to do |format|
					format.html { render '/users/signin', locals: { error: result[:result][:result], account: params[:user][:account] } }
					format.json { render json: result }
				end
			end

			user = result[:result]

			# Check if unactive
			if user.active_status == 1
				return respond_to do |format|
					format.html { redirect_to "/users/active_callout/#{user.id}?status=unactive" }
					format.json { render json: { status: 5, result: { status: 3, result: user.id } } }
				end
			end

			# Track session sign in
			# session_info = SessionInfo.find session[:session_info_id]
			# session_info.signed_users ||= []
			# session_info.signed_users << user.id unless session_info.signed_users.include? user.id
			# session_info.save

			# Store id into session
			session[:user_id] = user.id

			# Store account, password into cookie
			if params.has_key? :remember
				expires = 15.days.from_now
				cookies[:user_account] = {
					value: user.account,
					expires: expires
				}
				cookies[:user_password] = {
					value: user.password,
					expires: expires
				}
			else
				cookies.delete :user_account
				cookies.delete :user_password
			end

			respond_to do |format|
				format.html { redirect_to '/' }
				format.json { render json: { status: 0, result: user.id } }
			end
		end

		# Handle
		def signout
			session[:user_id] = nil
			cookies.delete :user_account
			cookies.delete :user_password

			redirect_to '/'
		end

		# Facebook signin
		
		def facebook_signin
			user = User.from_omniauth request.env['omniauth.auth']
			session[:user_id] = user.id
			render json: { status: 0 }
		end

		# / Facebook signin

	# / Sign in, out

	# Manager

		# View
		def manager
			# Author
			authorize! :manage, User

			@system_managers = User.search_by_type '', 'system_manager', true
			@user_managers = User.search_by_type '', 'user_manager', true
			@real_estate_managers = User.search_by_type '', 'real_estate_manager', true
			@project_managers = User.search_by_type '', 'project_manager', true
			@appraisers = User.search_by_type '', 'appraiser', true
			@statisticians = User.search_by_type '', 'statistician', true
		end

		# Partial view
		# params: is_add(*), type(*), page, keyword
		def _manager_list
			# Author
			return render json: { status: 6 } if cannot? :manage, User
			
			# Check unless exists is_add, type
			return render json: { status: 3 } unless params.has_key?(:is_add) && params.has_key?(:type)

			per = Rails.application.config.item_per_page
			page = params.has_key?(:page) ? params[:page].to_i : 1
			is_add = params[:is_add] === 'true'
			type = params[:type]

			users = User.search_by_type params[:keyword], type, !is_add

			count = users.count

			return render json: { status: 1 } if count === 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'users/manager_list', locals: { users: users.page(page, per), is_add: is_add }),
					pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per })
				}
			}
		end

		# params: id(*), type(*), is(*)
		def change_type
			render json: User.update_type_by_id(params[:id], params[:type], params[:is])
		end

	# / Manager

	# View

		# View
		# params: id(*)
		def view
			params[:id] ||= current_user.id
			begin
				@user = User.find(params[:id])
			rescue
				redirect_to '/'
			end    
		end

	# / View

	# List

		# View
		def list
			# Author
			authorize! :manage, User

			# Get params
			page 			= 	(params[:page] || 1).to_i
			per 			=	(params[:per] || 24).to_i
			search_params 	=	params[:search] || {}
			order_params 	= 	params[:order] || {}

			# Get users
			users = User.list_search_with_params search_params, order_params

			# Render result
			respond_to do |f|
				f.html {
					render 'list',
						layout: 'layout_back',
						locals: {
							users: 	users,
							page: 	page,
							per: 	per
						}
				}
				f.json {
					users_in_page = users.page page, per

					# Check if empty
					if users_in_page.count == 0
						render json: {
							status: 1
						}
					else
						render json: {
							status: 0,
							result: {
								list: render_to_string(
									partial: 'list',
									formats: :html,
									locals: {
										users: users_in_page
									}
								),
								paginator: render_to_string(
									partial: '/shared/pagination',
									formats: :html,
									locals: {
										total: 	users.count,
										per: 	per,
										page: 	page
									}
								)
							}
						}
					end
				}
			end
		end

	# / List

	# Visit counter

		# View
		def visit_counter
			@all = Session.all
			@online_users = []
			@online_guess_count = 0
			@day_count = 0
			@week_count = 0
			@month_count = 0
			@year_count = 0
			@in_day_users = []

			@all.each do |s|
				if s.updated_at > 15.minutes.ago
					if s.data['user_id'].present?
						@online_users << s.data['user_id']
					else
						@online_guess_count += 1
					end
				end

				if s.updated_at.year == Date.current.year
					@year_count += 1
					if s.updated_at.month == Date.current.month
						@month_count += 1
						if s.updated_at.day >= Date.current.at_beginning_of_week.day
							@week_count += 1
							if s.updated_at.day == Date.current.day
								@day_count += 1
								if s.data['user_id'].present?
									@in_day_users << s.data['user_id']
								end
							end
						end
					end
				end
			end

			@online_users = User.where id: @online_users.uniq, is_online: true
			@in_day_users = User.find @in_day_users.uniq

			render layout: 'layout_back'
		end

	# / Visit counter

	# Change password

		# Handle
		# params: form: id, old_password, password
		def change_password
			result = User.change_password params[:user]

			render json: result
		end

	# / Change password

	# Forgot password
		
		# View
		def forgot_password
		end

		# Handle
		# params: email(*)
		def forgot_password_handle
			result = User.restore_password params[:email]

			return render json: result if result[:status] != 0
			
			UserMailer.restore_password(result[:result][:user], result[:result][:new_password]).deliver_now
			
			render json: { status: 0, result: result[:result][:user].id }
		end

	# / Forgot password

	# Cancel change mail
		
		# Handle
		# params: id(*)
		def cancel_change_email
			render json: User.cancel_change_email(params[:id])
		end

	# / Cancel change mail

	# Autocomplete

		def autocomplete
			users = User.search(params[:keyword]).limit(10)
			
			users = users.where.not(id: params[:except]) if params[:except].present?

			render json: { 
				status: 0,
				result: users.all.map do |user|
					[user.id, "#{user.full_name} &lt;#{user.email}&gt;"]
				end.to_h
			}
		end

	# / Autocomplete

	# Zoho sync
	
		def zoho_sync

			User.zoho_sync

			render text: 'OK'

		end
	
	# / Zoho sync

end