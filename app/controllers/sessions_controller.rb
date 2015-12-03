class SessionsController < ApplicationController
	layout 'layout_back'

	# Index

		# View
		def index

		end

		# Json data
		# params: purpose (enum: host, campaign, time)
		def get_data
			sessions = Session.all
			# sessions = Session.search_with_params params

			data = []

			case params[:purpose]
			when 'host'
				sessions.reorder('').group(:referrer_host_name).count.each do |host_name, count|
					data << {
						label: host_name || 'Khác',
						count: count
					}
				end
			when 'campaign'
				sessions.reorder('').where('utm_campaign IS NOT NULL').group(:utm_campaign).count.each do |campaign, count|
					data << {
						label: campaign,
						count: count
					}
				end
			when 'time'
				sessions.group(:created_at).count.each do |created_at, count|
					data << {
						label: created_at,
						count: count
					}
				end
			end

			render json: { status: 0, result: data }
		end

	# / Index

end