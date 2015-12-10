class HomeController < ApplicationController
	layout 'layout_front'
	def index
			
	end

	# Search result

		# Handle => View
		# params: search form
		def search
			@res = @res_short = @projects = nil
			@search_params = {}
			if params[:search].present?

				@res = RealEstate.search_with_params params[:search].clone

				params[:search][:is_full] = 'false'
				@res_short = RealEstate.search_with_params params[:search].clone

				@projects = Project.search_with_params params[:search].clone
				
				@search_params = params[:search]
			end

			params.delete :search 
		end

		def _search_list
			params[:page] = params[:page].to_i
			params[:per] = params[:per].to_i

			if params[:part] == 'project'
				projects = Project.search_with_params params

				count = projects.count

				return render json: { status: 1 } if count == 0

				render json: {
					status: 0,
					result: {
						list: render_to_string(partial: 'projects/item_list', locals: { projects: projects.page(params[:page], params[:per]), type: params[:type].to_s }),
						pagination: render_to_string(partial: 'shared/pagination_2', locals: { total: count, per: params[:per], page: params[:page] })
					}
				}
			else
				res = RealEstate.search_with_params params

				count = res.count

				return render json: { status: 1 } if count == 0

				render json: {
					status: 0,
					result: {
						list: render_to_string(partial: 'real_estates/item_list', locals: { res: res.page(params[:page], params[:per]), type: (params[:is_full] == 'true' ? 1 : 3) }),
						pagination: render_to_string(partial: 'shared/pagination_2', locals: { total: count, per: params[:per], page: params[:page] })
					}
				}
			end
		end

	# / Search result

	def blog

	end

	def detail
	end
	
	def back
		render layout: 'layout_back'
	end

	# Handle
	# params: width_type
	def set_width
		cookies[:width_type] = params[:width_type]
		render plain: '0'
	end

	# Handle
	# def nothing
	#   render plain: '0'
	# end

	# Handle
	# def end_session
	#   current_user.update(is_online: false) if signed?
	#   render plain: '0'
	# end

	# View/Handle
	# params
	def error
		respond_to do |format|
			format.html { redirect_to("/search?error=#{params[:error]}") }
			format.json { render json: { status: params[:error] == '404' ? 1 : 2, result: params[:error] } }
		end
	end

	# Track session

		# Handle
		def track_session
			# If first time
			# unless session[:is_not_first]
			# 	session[:is_not_first] = true

			# 	# If was not give info
			# 	unless cookies[:was_give_info]
			# 		# If first time in browser (use cookie to detect)
			# 		# => Set current_session cookie data is begin session (befor save)
			# 		# Else
			# 		# => Set current begin_session_id to current_session (after save)
			# 		s = Session.new
			# 		if cookies[:begin_session_id].present?
			# 			s.begin_session_id = cookies[:begin_session_id]
			# 		end

			# 		if request.referrer.present?
			# 			s.referrer_host = URI(request.referrer).host.gsub(/\bwww./, '')
			# 			s.referrer_source = request.referrer
			# 			if s.referrer_host.include? 'facebook.com'
			# 				s.referrer_host_name = 'Facebook'
			# 			elsif s.referrer_host.include? 'muanhaonline.vn'
			# 				s.referrer_host_name = 'MuanhaOnline'
			# 			elsif s.referrer_host.include? 'google.com'
			# 				s.referrer_host_name = 'Google'
			# 			else
			# 				s.referrer_host_name = s.referrer_host
			# 			end
			# 		else
			# 			s.referrer_host_name = 'Direct'
			# 		end

			# 		s.utm_campaign = params[:utm_campaign] if params[:utm_campaign].present?
			# 		s.utm_source = params[:utm_source] if params[:utm_source].present?
			# 		s.utm_medium = params[:utm_medium] if params[:utm_medium].present?
			# 		s.utm_term = params[:utm_term] if params[:utm_term].present?
			# 		s.utm_content = params[:utm_content] if params[:utm_content].present?

			# 		s.save

			# 		if cookies[:begin_session_id].blank?
			# 			cookies[:begin_session_id] = s.id
			# 		end

			# 		session[:current_session_id] = s.id
			# 	end
			# end

			if session[:get_counter] == 1
				Session.find(session[:current_session_id]).update(user_info_type: nil) if session[:current_session_id].present?
			end

			render nothing: true
		end

	# / Track session
end