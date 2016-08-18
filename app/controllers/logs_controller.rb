class LogsController < ApplicationController

	# Index
	
		# View
		# params: page, per
		def index
			# Get params
			page 	= 	(params[:page] || 1).to_i
			per 	= 	(params[:per] || 10).to_i

			# Get logs
			logs 	= 	Log.get_without_view_action.get_for_build

			# Render result
			respond_to do |f|
				f.html {
					render 'index',
						layout: 'layout_back',
						locals: {
							logs: 	logs,
							page: 	page,
							per: 	per
						}
				}
				f.json {
					logs_in_page = logs.page page, per

					# Check if empty
					if logs_in_page.count == 0
						render json: {
							status: 1
						}
					else
						render json: {
							status: 0,
							result: render_to_string(
								partial: 'build',
								formats: :html,
								locals: {
									logs: logs_in_page
								}
							)
						}
					end
				}
			end
		end
	
	# / Index

end
