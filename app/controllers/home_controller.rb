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
						list: render_to_string(partial: 'real_estates/item_list', locals: { res: res.page(params[:page], params[:per]), type: (params[:is_full] == 'true' ? 1 : 4) }),
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

		# if params[:s] == '1'
		# 	SessionInfo.delete_all

		# 	rand = Random.new

		# 	(1..10000).each do
		# 		a = SessionInfo.new

		# 		# UTM

		# 			case rand.rand(1..10)
		# 			when 1,2,3
		# 				# Campaign name
		# 				a.utm_campaign = 'Campaign 1'
		# 				a.utm_source = 'Temporary'
		# 				a.utm_medium = 'Temporary'

		# 				# Campaign term
		# 				case rand.rand(1..20)
		# 				when 1
		# 					a.utm_term = 'Term 1'

		# 					# Campaign content
		# 					case rand.rand(1..10)
		# 					when 1,2,3
		# 						a.utm_content = 'Content 1'
		# 					when 4,5,6,7,8
		# 						a.utm_content = 'Content 2'
		# 					else
		# 						a.utm_content = 'Content 3'
		# 					end

		# 				when 2,3,4,5,6
		# 					a.utm_term = 'Term 2'

		# 					# Campaign content
		# 					case rand.rand(1..10)
		# 					when 1,2
		# 						a.utm_content = 'Content 4'
		# 					when 3,4,5,6,7,8
		# 						a.utm_content = 'Content 5'
		# 					else
		# 						a.utm_content = 'Content 6'
		# 					end
		# 				when 7,8,9,10
		# 					a.utm_term = 'Term 3'

		# 					# Campaign content
		# 					case rand.rand(1..10)
		# 					when 1,2,3,4
		# 						a.utm_content = 'Content 7'
		# 					when 5,6,7,8
		# 						a.utm_content = 'Content 8'
		# 					else
		# 						a.utm_content = 'Content 9'
		# 					end
		# 				when 11,12,13
		# 					a.utm_term = 'Term 4'

		# 					# Campaign content
		# 					case rand.rand(1..10)
		# 					when 1,2,3
		# 						a.utm_content = 'Content 10'
		# 					when 4,5,6
		# 						a.utm_content = 'Content 11'
		# 					else
		# 						a.utm_content = 'Content 12'
		# 					end
		# 				when 14,15
		# 					a.utm_term = 'Term 5'

		# 					# Campaign content
		# 					case rand.rand(1..10)
		# 					when 1
		# 						a.utm_content = 'Content 13'
		# 					when 4,5,6
		# 						a.utm_content = 'Content 14'
		# 					else
		# 						a.utm_content = 'Content 15'
		# 					end
		# 				else
		# 					a.utm_term = 'Term 6'

		# 					# Campaign content
		# 					case rand.rand(1..10)
		# 					when 1,2,3
		# 						a.utm_content = 'Content 16'
		# 					when 4,5,6,7
		# 						a.utm_content = 'Content 17'
		# 					else
		# 						a.utm_content = 'Content 18'
		# 					end
		# 				end
		# 			when 4,5,6,7,8
		# 				# Campaign name
		# 				a.utm_campaign = 'Campaign 2'
		# 				a.utm_source = 'Temporary'
		# 				a.utm_medium = 'Temporary'

		# 				# Campaign term
		# 				case rand.rand(1..20)
		# 				when 1
		# 					a.utm_term = 'Term 7'

		# 					# Campaign content
		# 					case rand.rand(1..10)
		# 					when 1,2,3
		# 						a.utm_content = 'Content 19'
		# 					when 4,5,6,7,8
		# 						a.utm_content = 'Content 20'
		# 					else
		# 						a.utm_content = 'Content 21'
		# 					end

		# 				when 2,3,4,5,6
		# 					a.utm_term = 'Term 8'

		# 					# Campaign content
		# 					case rand.rand(1..10)
		# 					when 1,2
		# 						a.utm_content = 'Content 22'
		# 					when 3,4,5,6,7,8
		# 						a.utm_content = 'Content 23'
		# 					else
		# 						a.utm_content = 'Content 24'
		# 					end
		# 				when 7,8,9,10
		# 					a.utm_term = 'Term 9'

		# 					# Campaign content
		# 					case rand.rand(1..10)
		# 					when 1,2,3,4
		# 						a.utm_content = 'Content 25'
		# 					when 5,6,7,8
		# 						a.utm_content = 'Content 26'
		# 					else
		# 						a.utm_content = 'Content 27'
		# 					end
		# 				else
		# 					a.utm_term = 'Term 10'

		# 					# Campaign content
		# 					case rand.rand(1..10)
		# 					when 1,2,3
		# 						a.utm_content = 'Content 28'
		# 					when 4,5,6,7
		# 						a.utm_content = 'Content 29'
		# 					else
		# 						a.utm_content = 'Content 30'
		# 					end
		# 				end
		# 			else
		# 				# Campaign name
		# 				a.utm_campaign = 'Campaign 3'
		# 				a.utm_source = 'Temporary'
		# 				a.utm_medium = 'Temporary'

		# 				# Campaign term
		# 				case rand.rand(1..20)
		# 				when 1,2,3
		# 					a.utm_term = 'Term 11'

		# 					# Campaign content
		# 					case rand.rand(1..10)
		# 					when 1,2,3
		# 						a.utm_content = 'Content 31'
		# 					when 4,5,6,7,8
		# 						a.utm_content = 'Content 32'
		# 					else
		# 						a.utm_content = 'Content 33'
		# 					end

		# 				when 7,8
		# 					a.utm_term = 'Term 12'

		# 					# Campaign content
		# 					case rand.rand(1..10)
		# 					when 1,2
		# 						a.utm_content = 'Content 34'
		# 					when 3,4,5,6,7,8
		# 						a.utm_content = 'Content 35'
		# 					else
		# 						a.utm_content = 'Content 36'
		# 					end
		# 				when 9,10,11,12,13,14,15,16
		# 					a.utm_term = 'Term 13'

		# 					# Campaign content
		# 					case rand.rand(1..10)
		# 					when 1,2,3,4
		# 						a.utm_content = 'Content 37'
		# 					when 5,6
		# 						a.utm_content = 'Content 38'
		# 					else
		# 						a.utm_content = 'Content 39'
		# 					end
		# 				else
		# 					a.utm_term = 'Term 14'

		# 					# Campaign content
		# 					case rand.rand(1..10)
		# 					when 1
		# 						a.utm_content = 'Content 40'
		# 					when 2,3,4,5,6
		# 						a.utm_content = 'Content 41'
		# 					else
		# 						a.utm_content = 'Content 42'
		# 					end
		# 				end
		# 			end

		# 		# / UTM

		# 		# Sign in

		# 			case rand.rand(1..5)
		# 			when 1
		# 				a.signed_users = [1]
		# 			end

		# 		# Sign in

		# 		# Leave info

		# 			case rand.rand(1..5)
		# 			when 1
		# 				a.leave_infos = ['contact_user', 1]
		# 			end

		# 		# / Leave info

		# 		# Time

		# 			a.created_at = rand.rand(0..200).days.ago

		# 		# / Time

		# 		a.save

		# 	end

		# end

		if params[:s] = '2'
			RealEstate.where.not(user_full_name: nil).each do |re|
			params[:contact] = {
				name: re.user_full_name || 'MuanhaOnline',
				email: re.user_email || 'info@muanhaonline.com.vn',
				phone_number: re.user_phone_number || '0939262426'
			}
			contact_user = ContactUserInfo.new
			result = contact_user.save_with_params params[:contact]
			if result[:status] == 5
				if result[:code] == 'user'
					re.user_type = 'user'
					re.user_id = result[:result].id
				else
					re.user_type = 'contact_user'
					re.user_id = result[:result].id
				end
			else
				re.user_type = 'contact_user'
				re.user_id = contact_user.id
			end
			re.save
		end
		end

		render layout: nil
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
end