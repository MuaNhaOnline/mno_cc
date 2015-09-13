class MailBoxesController < ApplicationController
  layout 'layout_back'
  skip_before_filter :verify_authenticity_token

# Compose

	# View
  # params: id
  def compose
    if params.has_key? :id
      begin
        @mail = MailBox.find params[:id]
      rescue
        @mail = MailBox.new
      end
    else
      @mail = MailBox.new
    end
    
    # Author
    if @mail.new_record?
      authorize! :create, MailBox
    else
      authorize! :continue, @mail
    end
  end

  # Handle
  # params: mail form
  def send_mail
    is_draft = params.has_key? :draft

    if params[:mail][:id].blank?
      mail = MailBox.new
      params[:mail][:from_id] = current_user.id unless current_user.nil?
    else 
      mail = MailBox.find params[:mail][:id]
      return render json: { status: 1 } if mail.nil?
    end

    result = mail.save_with_params params[:mail], is_draft

    return render json: result if result[:status] != 0
      
    render json: { status: 0, result: mail.id }
  end

# / Compose

# Inbox

  # View
  def inbox
    # Author
    authorize! :view_inbox, MailBox

    @mails = MailBox.get_current_inbox
  end

  # View
  def _inbox_list
    # Author
    return render json: { status: 6 } if cannot? :view_inbox, MailBox

    per = Rails.application.config.mail_item_per_page

    if params[:keyword].blank?
      mails = MailBox.get_current_inbox
    else
      mails = MailBox.get_current_inbox.search(params[:keyword])
    end

    count = mails.count

    return render json: { status: 1 } if count === 0

    render json: {
      status: 0,
      result: {
        list: render_to_string(partial: 'mail_boxes/inbox_list', locals: { mails: mails.page(params[:page].to_i, per) }),
        pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per })
      }
    }
  end

# / Inbox

# Sent

  # View
  def sent
    # Author
    authorize! :view_sent, MailBox

    @mails = MailBox.get_current_sent
  end

  # View
  def _sent_list
    # Author
    return render json: { status: 6 } if cannot? :view_sent, MailBox

    per = Rails.application.config.mail_item_per_page

    if params[:keyword].blank?
      mails = MailBox.get_current_sent
    else
      mails = MailBox.get_current_sent.search(params[:keyword])
    end

    count = mails.count

    return render json: { status: 1 } if count === 0

    render json: {
      status: 0,
      result: {
        list: render_to_string(partial: 'mail_boxes/sent_list', locals: { mails: mails.page(params[:page].to_i, per) }),
        pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per })
      }
    }
  end

# / Sent

# Draft

  # View
  def draft
    # Author
    authorize! :view_sent, MailBox

    @mails = MailBox.get_current_draft
  end

  # View
  def _draft_list
    # Author
    return render json: { status: 6 } if cannot? :view_draft, MailBox

    per = Rails.application.config.mail_item_per_page

    if params[:keyword].blank?
      mails = MailBox.get_current_draft
    else
      mails = MailBox.get_current_draft.search(params[:keyword])
    end

    count = mails.count

    return render json: { status: 1 } if count === 0

    render json: {
      status: 0,
      result: {
        list: render_to_string(partial: 'mail_boxes/draft_list', locals: { mails: mails.page(params[:page].to_i, per) }),
        pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per })
      }
    }
  end

# / Draft

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