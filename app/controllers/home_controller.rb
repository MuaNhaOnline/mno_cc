class HomeController < ApplicationController
	layout 'front_layout'

	def index
	end

	# Search result

		def search
			page = params[:page] || 1
			params[:search] ||= {}

			@res = RealEstate.search_with_params_2(
				params[:search].clone,
				{
					paginate: {
						page: page,
						per_page: 12	
					}
				}
			)
		end

		# Get
		# params: bounds
		def search_by_bounds
			bounds = params[:bounds]

			@res = RealEstate.search_with_params bounds: bounds

			result = {}
			@res.each do |re|
				result[re.id] = { lat: re.lat, lng: re.lng, title: re.title, url: "/bat-dong-san/#{re.full_slug}" }
			end

			render json: {
				status: 0,
				result: result
			}
		end

	# / Search result

	def blog

	end

	def detail
	end
	
	def back

		return render layout: 'back_layout'

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
	# params: error
	def error
		respond_to do |format|
			format.html { 
				render 'error', locals: { error: params[:error] }
			}
			format.json {
				render json: { status: params[:error] == '404' ? 1 : 2, result: params[:error] }
			}
		end
	end
end