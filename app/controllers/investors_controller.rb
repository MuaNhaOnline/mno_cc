class InvestorsController < ApplicationController
	layout 'layout_back'

	# View
	
		# View
		# params: id(*)
		def view
			@investor = Investor.find params[:id]
		end
	
	# / View

	# Create
	
		# View
		# params: id
		def create
			@investor = params[:id].present? ? Investor.find(params[:id]) : Investor.new
		end

		# Handle
		# params: investor form
		def save
			investor = params[:investor][:id].present? ? Investor.find(params[:investor][:id]) : Investor.new
			result = investor.save_with_params params[:investor]

			render json: result
		end
	
	# / Create

# Manager

	# View
	def manager
		# Author
		authorize! :manager, Investor

		@investors = Investor.order(updated_at: 'asc')

		render layout: 'layout_back'
	end

	# Partial view
	# params: keyword
	def _manager_list
		# Author
		return render json: { staus: 6 } if cannot? :manager, Investor

		per = Rails.application.config.item_per_page

		if params[:keyword].blank?
			investors = Investor.order(updated_at: 'asc')
		else
			investors = Investor.search(params[:keyword])
		end

		count = investors.count

		return render json: { status: 1 } if count === 0

		render json: {
			status: 0,
			result: {
				list: render_to_string(partial: 'investors/manager_list', locals: { investors: investors.page(params[:page].to_i, per) }),
				pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per })
			}
		}
	end

	# Handle
	# params: id(*), name(*)
	def rename
		result = Investor.update_name(params[:id], params[:name], params[:avatar_id])

		return render json: result if result[:status] != 0

		render json: { status: 0, avatar_url: result[:result].avatar.url(:thumb) }
	end

# / Manager

# Autocomplete

	def autocomplete
		investors = Investor.search(params[:keyword]).limit(10)

		list = []
		investors.each do |i|
			list << { value: i.id, text: i.name }
		end

		render json: { status: 0, result: list }
	end

# / Autocomplete

# Delete

	# Handle
	# params: id(*)
	def delete
		render json: Investor.delete_by_id(params[:id])
	end

# / Delete

end
