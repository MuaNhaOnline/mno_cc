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
			contact = ContactUserInfo.new
			params[:contact][:session_id] = session[:current_session_id]

			result = contact.save_with_params(params[:contact])

			if result[:status] == 0
				cookies[:was_give_info] = true
				Session.find(session[:current_session_id]).update(user_info_type: 'contact', user_info_id: contact.id)
			end

			render json: result
		end

	# / Create

end
