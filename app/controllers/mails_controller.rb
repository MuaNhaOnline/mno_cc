class MailsController < ApplicationController

	layout 'layout_back'

	# Index
	
		def index
			# Author
			authorize! :view_my, SystemMail

			# Get params
			page 		= 	(params[:page] || 1).to_i
			per 		=	(params[:per] || 10).to_i
			by_type		=	params[:by_type] || 'inbox'

			# Get mail
			mails 		= 	eval("SystemMail.my_#{by_type}_list");

			# Render result
			respond_to do |f|
				f.html {
					render 'index',
						locals: {
							mails: 		mails,
							page: 		page,
							per: 		per,
							by_type: 	by_type
						}
				}
				f.json {
					mails_in_page 	= 	mails.page page, per
					max_page 		= 	(mails.count.to_f / per).ceil

					# Check if empty
					if mails_in_page.count == 0
						render json: {
							status: 1
						}
					else
						render json: {
							status: 0,
							result: {
								list: 		render_to_string(
												partial: 'index',
												formats: :html,
												locals: {
													mails: mails_in_page
												}
											),
								page: 		page,
								max_page: 	max_page,
								by_type: 	by_type
							}
						}
					end
				}
			end
		end
	
	# / Index

	# View
	
		# View
		# params: id
		def view
			# Get mail
			mail = SystemMail.find params[:id]

			# Render response
			respond_to do |f|
				f.json {
					render json: {
						status: 0,
						result: render_to_string(
							partial: 	'view',
							formats: 	:html,
							locals: 	{
											mail: mail
										}
						)
					}
				}
			end
		end
	
	# / View

	# Save

		# Partial
		# params: reply_id
		def _form
			# Build new mail
			mail = SystemMail.new

			# Check if reply
			if params[:reply_id].present?
				# Set reply id
				mail.reply_id = params[:reply_id]

				# Build default subject or remove reply_id if this not exists
				if mail.replied_mail.present?
					mail.subject = mail.replied_mail.subject
					if mail.subject.index('[Trả lời]') != 0
						mail.subject = '[Trả lời] ' + mail.subject
					end
				else
					mail.reply_id = nil
				end
			end

			render json: { 
				status: 0,
				result: render_to_string(partial: 'form', locals: { mail: mail })
			}
		end
	
		# Handle
		# params: mail form
		def save
			# Get mail
			mail = SystemMail.new				

			if signed?
				# Set currentuser
				params[:mail][:sender_type] = 	'user'
				params[:mail][:sender_id] 	= 	current_user.id
			else
				# New & get contact
				contact_user = __save_contact_user_info params[:contact_info]

				# Check if error
				return render json: { status: 2 } unless contact_user

				params[:mail][:sender_type] =	'contact_user'
				params[:mail][:sender_id] 	=	contact_user.id
			end

			# Save mail
			unless mail.save_with_params params[:mail]
				# Error
				return render json: { status: 2 }
			end

			# Success
			render json: { status: 0 }
		end
	
	# / Save

	# Request
	
		# View
		def requested_list
			# Author
			authorize! :manage, SystemMail

			# Get params
			page 		= 	(params[:page] || 1).to_i
			per 		=	(params[:per] || 10).to_i
			by_status 	=	params[:by_status] || 'need_contact'

			# Get request
			requests = eval("RequestedSystemMail.#{by_status}_list")

			# Render result
			respond_to do |f|
				f.html {
					render 'requested_list',
						locals: {
							requests: 	requests,
							page: 		page,
							per: 		per,
							by_status: 	by_status
						}
				}
				f.json {
					requests_in_page = requests.page page, per

					# Check if empty
					if requests_in_page.count == 0
						render json: {
							status: 1
						}
					else
						render json: {
							status: 0,
							result: {
								list: render_to_string(
									partial: 'requested_list',
									formats: :html,
									locals: {
										requests: requests_in_page
									}
								),
								paginator: render_to_string(
									partial: '/shared/paginator',
									formats: :html,
									locals: {
										total: 	requests.count,
										per: 	per,
										page: 	page
									}
								)
							}
						}
					end
				}
			end
		end

		# Handle
		# params: id, requested form
		def save_request
			# Author
			authorize! :manage, SystemMail

			# Get request
			request = RequestedSystemMail.find params[:id]

			# Save
			unless request.save_with_params params[:request]
				return render json: { status: 2 }
			end

			# Success
			render json: { status: 0 }
		end
	
	# / Request

	# Delete
		
		# Handle
		# params: ids
		def delete
			# Author
			authorize! :set_my, SystemMail

			# Get mails
			mails = SystemMail.find params[:ids]

			# Set delete
			mails.each do |mail|
				mail.set_delete
			end

			# Render result
			render json: {
				status: 0
			}
		end
	
	# / Delete

end
