class SessionsController < ApplicationController
	layout 'layout_back'

	# Index

		# View
		def index

		end

		# Json data
		# params: purpose (enum: host, campaign, time), date_from, date_to
		def get_data
			where = []
			case params[:purpose]
			when 'year'
				date_from = Date.strptime(params[:date_from], '%Y') if params[:date_from].present?
				date_to = Date.strptime(params[:date_to], '%Y').next_year if params[:date_to].present?
			when 'month'
				date_from = Date.strptime(params[:date_from], '%m/%Y') if params[:date_from].present?
				date_to = Date.strptime(params[:date_to], '%m/%Y').next_month if params[:date_to].present?
			else
				date_from = Date.strptime(params[:date_from], '%d/%m/%Y') if params[:date_from].present?
				date_to = Date.strptime(params[:date_to], '%d/%m/%Y').next_day if params[:date_to].present?
			end

			if params[:date_from].present? && params[:date_to].present? && date_from > date_to
				date_temporary = date_from
				date_from = date_to
				date_to = date_temporary
			end
			
			if params[:date_from].present?
				where << "created_at > '#{date_from}'"
			end
			if params[:date_to].present?
				where << "created_at < '#{date_to}'"
			end

			sessions = Session.where(where.join(' AND '))

			visitor_data = []
			lead_data = []

			case params[:purpose]
			when 'host'
				sessions.reorder('').group_by{ |s| s.referrer_host_name }.each do |host_name, sessions_by_host_name|

					visitor_count = 0
					lead_count = 0

					sessions_by_host_name.group_by{ |s| s.user_info_type.blank? ? 'visitor' : 'lead' }.each do |status, sessions_by_status|
						if status == 'visitor'
							visitor_count = sessions_by_status.count
						else
							lead_count = sessions_by_status.count
						end
					end

					visitor_data << {
						label: host_name,
						count: visitor_count
					}
					lead_data << {
						label: host_name,
						count: lead_count
					}
				end
			when 'campaign'
				sessions.reorder('').group_by{ |s| s.utm_campaign }.each do |campaign, sessions_by_campaign|

					visitor_count = 0
					lead_count = 0

					sessions_by_campaign.group_by{ |s| s.user_info_type.blank? ? 'visitor' : 'lead' }.each do |status, sessions_by_status|
						if status == 'visitor'
							visitor_count = sessions_by_status.count
						else
							lead_count = sessions_by_status.count
						end
					end

					visitor_data << {
						label: campaign,
						count: visitor_count
					}
					lead_data << {
						label: campaign,
						count: lead_count
					}
				end
			when 'day'
				sessions.group_by{ |s| s.created_at.month.to_s + '/' + s.created_at.day.to_s + '/' + s.created_at.year.to_s }.each do |time, sessions_by_time|

					visitor_count = 0
					lead_count = 0

					sessions_by_time.group_by{ |s| s.user_info_type.blank? ? 'visitor' : 'lead' }.each do |status, sessions_by_status|
						if status == 'visitor'
							visitor_count = sessions_by_status.count
						else
							lead_count = sessions_by_status.count
						end
					end

					visitor_data << {
						label: time,
						count: visitor_count
					}
					lead_data << {
						label: time,
						count: lead_count
					}
				end
			when 'month'
				sessions.group_by{ |s| s.created_at.month.to_s + '/' + s.created_at.year.to_s }.each do |time, sessions_by_time|

					visitor_count = 0
					lead_count = 0

					sessions_by_time.group_by{ |s| s.user_info_type.blank? ? 'visitor' : 'lead' }.each do |status, sessions_by_status|
						if status == 'visitor'
							visitor_count = sessions_by_status.count
						else
							lead_count = sessions_by_status.count
						end
					end

					visitor_data << {
						label: time,
						count: visitor_count
					}
					lead_data << {
						label: time,
						count: lead_count
					}
				end
			when 'year'
				sessions.group_by{ |s| s.created_at.year.to_s }.each do |time, sessions_by_time|

					visitor_count = 0
					lead_count = 0

					sessions_by_time.group_by{ |s| s.user_info_type.blank? ? 'visitor' : 'lead' }.each do |status, sessions_by_status|
						if status == 'visitor'
							visitor_count = sessions_by_status.count
						else
							lead_count = sessions_by_status.count
						end
					end

					visitor_data << {
						label: time,
						count: visitor_count
					}
					lead_data << {
						label: time,
						count: lead_count
					}
				end
			end

			render json: { status: 0, result: { visitors: visitor_data, leads: lead_data } }
		end

	# / Index

end