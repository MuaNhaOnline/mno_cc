class ContactUserInfosController < ApplicationController

	# Create

		# Handle
		# params: contact form
		def save
			# unless params.has_key? :replace
			# 	# Check if exist contact with same email or phone number
			# 	same_contact = ContactUserInfo.where("phone_number ~ '(\\y|,){1}(#{params[:contact][:phone_number].gsub(',', '|')})(\\y|,){1}' OR email ~ '(\\y|,){1}(#{params[:contact][:email].gsub(',', '|')})(\\y|,){1}'").first

			# 	if same_contact.present?
			# 		return render json: { 
			# 			status: 5,
			# 			result: render_to_string(partial: 'contact_user_infos/same_contact', locals: { same_contact: same_contact })
			# 		}
			# 	end
			# end

			# contact = params[:replace].present? ? ContactUserInfo.find(params[:replace]) : ContactUserInfo.new

			# params[:contact][:session_info_id] = session[:session_info_id]

			# result = contact.save_with_params(params[:contact])

			# if result[:status] == 0
			# 	session_info = SessionInfo.find session[:session_info_id]
			# 	session_info.leave_infos ||= []
			# 	session_info.leave_infos << ['contact_user', contact.id]
			# 	session_info.save

			# 	# Add request
			# 	ContactRequest.create user_id: contact.id, user_type: 'contact_user', message: params[:contact][:message], request_type: params[:contact][:request][:type], object_type: params[:contact][:request][:object], object_id: params[:contact][:request][:value], status: 1
			# end

			# render json: result
		end

	# / Create

end
