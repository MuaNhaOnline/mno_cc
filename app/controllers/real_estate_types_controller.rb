class RealEstateTypesController < ApplicationController
	# Get
	# params: keyword, except
	def get_by_keyword
		keyword = params[:keyword]
		except = params[:except].split(',')

		types = RealEstateType.where.not(id: except).search(keyword)

		if types.count == 0
			return render json: { status: 1 }
		end

		render json: {
			status: 0,
			result: types.all.map do |type|
				[type.id, type.display_name]
			end.to_h
		}
	end
end
