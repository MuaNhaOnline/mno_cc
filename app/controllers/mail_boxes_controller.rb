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
    is_draft = params.has_key? :draft

    mail = MailBox.new

    params[:mail][:from_id] = current_user.id unless current_user.nil?

    if is_draft
      result = mail.save_draft params[:mail]
    else
      result = mail.send_mail params[:mail]
    end

    if result[:status] != 0
      render json: result
    else
      render json: { status: 0, result: mail.id }
    end
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

# Remove

  # Handle
  # params: id(*),
  def sent_remove
    result = MailBox.remove_by_ids params[:ids].split(','), 'from'

    render json: result
  end

  # Handle
  # params: id(*),
  def inbox_remove
    result = MailBox.remove_by_ids params[:ids].split(','), 'to'

    render json: result
  end

# / Remove

end