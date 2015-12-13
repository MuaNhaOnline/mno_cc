class ContactUserInfosController < ApplicationController

	# Index

		# View
		def index
			@contacts = ContactUserInfo.order created_at: 'desc'
			render layout: 'layout_back'
		end

		# Partial view
		# params: page
		def _index_list
			per = 12

			params[:page] ||= 1
			params[:page] = params[:page].to_i

			contacts = ContactUserInfo.order created_at: 'desc'

			count = contacts.count

			return render json: { status: 1 } if count == 0

			render json: {
				status: 0,
				result: {
					list: render_to_string(partial: 'contact_user_infos/index_list', locals: { contacts: contacts.page(params[:page], per) }),
					pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per, page: params[:page] })
				}
			}
		end

	# / Index

	# View history

		# Partial view
		# params: id(*)
		def _view_history
			@contact = ContactUserInfo.find(params[:id])

			return render json: { status: 1 } if @contact.session_id.blank?

			if @contact.session.begin_session_id.blank?
				@sessions = [ @contact.session ]
			else
				@sessions = @contact.session.begin_session.flow_sessions
			end

			render json: {
				status: 0,
				result: render_to_string(partial: 'contact_user_infos/view_history')
			}
		end

	# / View history

	# Create

		# Handle
		# params: contact form
		def save
			unless params.has_key? :force
				# Check if exist contact with same email or phone number
				same_contacts = ContactUserInfo.where("phone_number = '#{params[:contact][:phone_number]}' OR email = '#{params[:contact][:email]}'")
				
				if same_contacts.count != 0
					return render json: { 
						status: 5,
						result: render_to_string(partial: 'contact_user_infos/same_contacts', locals: { same_contacts: same_contacts })
					}
				end
			end

			contact = params[:replace].present? ? ContactUserInfo.find(params[:replace]) : ContactUserInfo.new
			params[:contact][:session_id] = session[:current_session_id] if session[:current_session_id].present?

			result = contact.save_with_params(params[:contact])

			if result[:status] == 0
				cookies[:was_give_info] = true

				if session[:current_session_id].present?
					s = Session.find(session[:current_session_id])
					if s.user_info_type.present?
						s.user_info_type += ',contact'
					else
						s.user_info_type = 'contact'
					end
					s.save
				end
			end

			render json: result
		end

	# / Create

end
