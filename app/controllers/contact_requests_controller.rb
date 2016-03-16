class ContactRequestsController < ApplicationController

	# Index

		# View
		def index
			@contacts = ContactRequest.need_contact
			render layout: 'layout_back'
		end

		# Partial view
		# params: page
		def _index_list
			per = 12

			params[:page] ||= 1
			params[:page] = params[:page].to_i

			contacts = ContactRequest.need_contact

			count = contacts.count

			return render json: { status: 1 } if count == 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'contact_requests/index_list', locals: { contacts: contacts.page(params[:page], per) }),
					pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per, page: params[:page] })
				}
			}
		end

		# Statistic
		# Partial view
		# params: type(*), id(*)
		def _view_statistic
			request = ContactRequest.find params[:id]

			case request.user_type
			when 'user'

			when 'contact_user'
				session_info = request.contact_user_request.session_info

				if session_info.begin_session_info_id.present?
					@sessions = session_info.begin_session_info.flow_session_infos
				else
					@sessions = [ session_info ]
				end
			end

			render json: {
				status: 0,
				result: render_to_string(partial: 'contact_requests/view_statistic')
			}
		end

		# Set result after contact
		# Handle
		# params: result form (contact_request_id, status, content)
		def set_result
			request = ContactRequest.find(params[:result][:contact_request_id])
			request.status = params[:result][:status]

			request.save

			render json: ContactRequestResult.new.save_with_params(params[:result])
		end

	# / Index

	# Insert
		
		# Handle
		# params: type, object, value
		def new
			ContactRequest.create user_id: current_user.id, user_type: 'user', request_type: params[:request][:type], object_type: params[:request][:object], object_id: params[:request][:value], message: params[:request][:message], status: 1
			render json: { status: 0 }
		end
	
	# / Insert

end
