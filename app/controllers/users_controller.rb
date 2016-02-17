class UsersController < ApplicationController
	layout 'layout_back'

	# Sign up
		
		# View
		def create
			if (params.has_key?(:id))
				begin
					@user = User.find(params[:id])
				rescue
					@user = User.new
				end
			else
				@user = User.new
			end
			
			# Author
			if @user.new_record?
				authorize! :signup, nil
			else  
				authorize! :edit, @user
			end
		end

		# Handle
		# params: form user
		def save
			if is_sign_up = params[:user][:id].blank?
				user = User.new
			else 
				user = User.find(params[:user][:id])
				if user.nil?
					return render json: { status: 1 }
				end
			end

			result = user.save_with_params params[:user]
			
			# If error
			return render json: result if result[:status] != 0

			# If signup
			if is_sign_up
				session_info = SessionInfo.find session[:session_info_id]
				session_info.leave_infos ||= []
				session_info.leave_infos << ['user', user.id]
				session_info.save
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

	# / Sign up

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
			authorize! :signin, nil
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
				return redirect_to '/' if result[:status] == 6
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
			session_info = SessionInfo.find session[:session_info_id]
			session_info.signed_users ||= []
			session_info.signed_users << user.id unless session_info.signed_users.include? user.id
			session_info.save

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
			begin
				@user = User.find(params[:id])
			rescue
				redirect_to '/'
			end    
		end

	# / View

	# View all

		# View
		def view_all
			@users = User.view_all_search_with_params interact: 'desc'
		end

		# Partial view
		# params: keyword, interact, real_estate_count, project_count
		def _view_all_list
			per = 24

			params[:page] ||= 1
			params[:page] = params[:page].to_i

			users = User.view_all_search_with_params params

			count = users.count

			return render json: { status: 1 } if count == 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'users/view_all_list', locals: { users: users.page(params[:page], per) }),
					pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per, page: params[:page] })
				}
			}
		end

	# / View all

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

			list = []
			users.each do |user|
				list << { value: user.id, text: user.full_name }
			end

			render json: { status: 0, result: list }
		end

	# / Autocomplete

	# Zoho sync
	
		def zoho_sync

			# Helper method

				def add_xml_nodes xml, user, attributes

					has_node = false

					attributes.each do |attribute|

						# Get field (zoho) from attribute (mno)
						field = User.zoho_parse_field attribute

						# If not present => not add
						if field.present?

							case user[attribute].class
							when Date
								text = user[attribute].strftime '%m/%d/%Y'
							else
								text = user[attribute]
							end

							# Add node
							xml.FL(val: field) {
								xml.text text
							}

							has_node = true
						end

					end

					has_node

				end

				def get_content_by_val array, val
					array.each do |element|
						return element['__content__'] if element['val'] == val
					end

					nil
				end
			
			# / Helper method

			# Create new leads
			
				# Get all users without zoho lead id
				users = User.where zoho_lead_id: nil

				# If exist
				if users.count > 0

					# Create xml records
					leads_record = Nokogiri::XML::Builder.new do |xml|
						xml.Leads {
							users.each_with_index do |user, index|

								xml.row(no: index + 1) {
									add_xml_nodes xml, user, User.zoho_fields
								}

							end
						}
					end

					result = HTTParty.post(
						'https://crm.zoho.com/crm/private/xml/Leads/insertRecords', 
						body: {
							authtoken: '427ecfa73f98d6aa29f7e932d3c2913f',
							scope: 'crmapi',
							xmlData: leads_record.to_xml,
							version: 4
						}
					)

					if result['response']['result'].present?
					end

					if result['response']['result'].present?
						if result['response']['result']['row'].class == Array
						result['response']['result']['row'].each_with_index do |record, index|
							if record.has_key? 'success'
								users[index].zoho_lead_id = get_content_by_val record['success']['details']['FL'], 'Id'
								users[index].zoho_changed_fields = []
								users[index].save
							end
						end
						else
							record = result['response']['result']['row'].first
							if record[0] == 'success'
								users[0].zoho_lead_id = get_content_by_val record[1]['details']['FL'], 'Id'
								users[0].zoho_changed_fields = []
								users[0].save
							end
						end
					end

				end
			
			# / Create new leads

			# Update leads
			
				# Get all user has zoho changed field with zoho lead id
				users = User.where.not zoho_changed_fields: nil, zoho_lead_id: nil

				# If exist
				if users.count > 0

					# Create xml records
					leads_record = Nokogiri::XML::Builder.new do |xml|
						xml.Leads {
							users.each_with_index do |user, index|

								xml.row(no: index + 1) {
									add_xml_nodes xml, user, user.zoho_changed_fields + ['zoho_lead_id']
								}

							end
						}
					end

					result = HTTParty.post(
						'https://crm.zoho.com/crm/private/xml/Leads/updateRecords', 
						body: {
							authtoken: '427ecfa73f98d6aa29f7e932d3c2913f',
							scope: 'crmapi',
							xmlData: leads_record.to_xml,
							version: 4
						}
					)

					if result['response']['result'].present?
						if result['response']['result']['row'].class == Array
							result['response']['result']['row'].each_with_index do |record, index|
								if record.has_key? 'success'
									users[index].zoho_changed_fields = []
									users[index].save
								end
							end
						else
							record = result['response']['result']['row'].first
							if record[0] == 'success'
								users[0].zoho_changed_fields = []
								users[0].save
							end
						end
					end

				end
			
			# / Update leads

			render 'home/back'

		end
	
	# / Zoho sync

end