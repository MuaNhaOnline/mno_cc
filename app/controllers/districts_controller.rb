class DistrictsController < ApplicationController

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

end
