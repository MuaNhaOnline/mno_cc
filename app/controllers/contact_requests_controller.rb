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

	# Save
		
		# Handle
		# params: request form
		def save
			if signed?
				# If signed => save request with current user
				request = params[:request][:id].present? ? 
					ContactRequest.find(params[:request][:id]) : 
					ContactRequest.new(user_id: current_user.id, user_type: 'user')
				
				request.save_with_params(params[:request])

				render json: { 
					status: 0, 
					result: {
						request_id: request.id
					} 
				}
			else
				# If not signed => get contact info
				contact_user = params[:contact][:id].present? ? ContactUserInfo.find(params[:contact][:id]) : ContactUserInfo.new

				result = contact_user.save_with_params params[:contact], params[:contact][:id].present?
				if result[:status] == 5
					# If exists data => confirm
					return render json: {
						status: 5,
						result: {
							same_contact: result[:result].to_json(only: [:id]),
							html: render_to_string(partial: 'contact_user_infos/same_contact', locals: { code: result[:code], same_contact: result[:result] })
						}
					}
				end

				# Save cookie, session contact info
				cookies[:contact_user_id] = {
					value: contact_user.id,
					expires: 3.months.from_now
				}
				session[:contact_user_id] = contact_user.id

				# Create request
				request = params[:request][:id].present? ? 
					ContactRequest.find(params[:request][:id]) : 
					ContactRequest.new(user_id: contact_user.id, user_type: 'contact_user')
				
				request.save_with_params(params[:request])

				render json: { 
					status: 0, 
					result: {
						request_id: request.id,
						contact_id: contact_user.id
					}
				}
			end
		end
	
	# / Save

	# Request manage
	
		# View
		def manage
			# Author
			# authorize! :manage, ContactRequest

			@requests = ContactRequest.need_contact

			render layout: 'layout_back'
		end

		# Partial view
		# params: page
		def _manage_list
			# Author
			# authorize! :manage, ContactRequest

			page = (params[:page] || 1).to_i + 1
			begin
				requests = ContactRequest.need_contact

				page -= 1
				per = 10
				count = requests.count

				requests_in_page = requests.page(page, per)
			end while requests_in_page.count == 0 && page != 1

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'manage_list', locals: { requests: requests_in_page }),
					pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per, page: page })
				}
			}
		end

		# Partial view
		# params: user_type, user_id
		def _manage_user_info
			# Author
			authorize! :manage, RealEstate

			case params[:user_type]
			when 'user'
				render json: {
					status: 0,
					result: render_to_string(partial: 'users/info_popup', locals: { user: User.find(params[:user_id]) })
				}
			when 'contact_user'
				render json: {
					status: 0,
					result: render_to_string(partial: 'contact_user_infos/info_popup', locals: { contact_user: ContactUserInfo.find(params[:user_id]) })
				}
			else
				render json: { status: 1 }
			end
		end

		# Handle
		# params: request form,
		def manage_save
			request = ContactRequest.find params[:request][:id]

			case request.object_type
			when 'real_estate'
				# Author
				authorize! :manage, RealEstate
			when 'project'
				# Author
				authorize! :manage, Project
			end

			result = request.manage_save_with_params(params[:request])

			render json: {
				status: 0
			}
		end
	
	# / Request manage

end
