class MailBoxesController < ApplicationController
  layout 'layout_back'
  skip_before_filter :verify_authenticity_token

# Compose

	# View
  def compose
    # Author
    authorize! :create, MailBox
  end

  # Handle
  # params: mail form
  def send_mail
    mail = MailBox.new

    params[:mail][:from_id] = current_user.id unless current_user.nil?

  	result = mail.save_with_params params[:mail]

  	render json: result
  end

# / Compose

# Inbox

  # View
  def inbox
    # Author
    authorize! :view_inbox, MailBox

    @mails = MailBox.get_current_inbox
  end

# / Inbox

# Read, reply

  # View
  # params: id(*)
  def read
    @mail = MailBox.find(params[:id])
  end

# / Read, reply

end