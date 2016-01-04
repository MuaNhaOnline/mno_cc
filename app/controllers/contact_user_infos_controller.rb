class ContactUserInfosController < ApplicationController

	# Create

		# Handle
		# params: contact form
		def save
			unless params.has_key? :force
				# Check if exist contact with same email or phone number
				same_contacts = ContactUserInfo.where("phone_number ~ '(\\y|,){1}#{params[:contact][:phone_number]}(\\y|,){1}' OR email LIKE '(\\y|,){1}#{params[:contact][:email]}(\\y|,){1}'")

				if same_contacts.count != 0
					return render json: { 
						status: 5,
						result: render_to_string(partial: 'contact_user_infos/same_contacts', locals: { same_contacts: same_contacts })
					}
				end
			end

			contact = nil
			if params[:append].present?
				contact = ContactUserInfo.find(params[:append])
				params[:contact][:phone_number] = "#{contact.phone_number},#{params[:contact][:phone_number]}" unless contact.phone_number =~ /(\b|,){1}#{Regexp.escape(params[:contact][:phone_number])}(\b|,){1}/
				params[:contact][:email] = "#{contact.email},#{params[:contact][:email]}" unless contact.email =~ /(\b|,){1}#{Regexp.escape(params[:contact][:email])}(\b|,){1}/
			else
				contact = ContactUserInfo.new
			end

			params[:contact][:session_info_id] = session[:session_info_id]

			result = contact.save_with_params(params[:contact])

			if result[:status] == 0
				session_info = SessionInfo.find session[:session_info_id]
				session_info.leave_infos ||= []
				session_info.leave_infos << ['contact_user', contact.id]
				session_info.save

				# Add request
				ContactRequest.create user_id: contact.id, user_type: 'contact_user', message: params[:contact][:message], status: 1
			end

			render json: result
		end

	# / Create

end
