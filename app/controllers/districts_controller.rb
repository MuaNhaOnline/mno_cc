class DistrictsController < ApplicationController

	layout 'layout_back'

	# Get
		
		# Get data
		# params: province_id(*)
		def get_by_province
			districts = District.where(province_id: params[:province_id])

			return render json: { status: 1 } if districts.blank?

			render json: {
				status: 0,
				result: districts.map{ |district| { id: district.id, name: district.name } }
			}
		end
	
	# / Get

	# Manage
	
		# View/Partial view
		# params:
		# 	search: province_id
		def manage
			# Author
			authorize! :manage, District

			# Get params
			page 			= 	(params[:page] || 1).to_i
			per 			=	(params[:per] || 30).to_i
			search_params 	=	params[:search] || { province_id: 1 }

			# Build conditions
			conditions = {}
			if search_params[:province_id].present?
				conditions[:province_id] = search_params[:province_id]
			end

			# Get districts
			districts = District.where(conditions)

			# Render result
			respond_to do |f|
				f.html {
					render 'manage',
						locals: {
							province_id: 	search_params[:province_id],
							districts: 		districts
						}
				}
				f.json {
					render json: {
						status: 0,
						result: render_to_string(
							partial: 'manage',
							formats: :html,
							locals: {
								districts: districts
							}
						)
					}
				}
			end
		end
	
	# / Manage

	# Change order
		
		# Handle
		# params: id, order
		def update_order
			# Author
			authorize! :manage, District

			# Get district
			district = District.find params[:id]

			result = district.set_order params[:order]

			render json: result
		end
	
	# / Change order

end
