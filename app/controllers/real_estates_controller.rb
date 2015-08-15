class RealEstatesController < ApplicationController
  layout 'layout_front'
  skip_before_filter :verify_authenticity_token

  # def index
  #   @real_estates = RealEstate.where(is_draft: 0, is_show: 1).limit(6)
  # end

  # def category

  # end

  # def view
  # #   begin
  # #     @real_estate = RealEstate.find(params['id'])
  # #   rescue
  # #     redirect_to '/real_estates/index'
  # #   end
  #   redirect_to '/' + params[:id]
  # end

# Create

  # View
  # params: id (if edit)
  def create
    if (params.has_key?('id'))
      begin
        @re = RealEstate.find(params['id'])
      rescue
        @re = RealEstate.new
      end
    else
      @re = RealEstate.new
    end
    
    # Author
    if @re.new_record?
      authorize! :create, RealEstate
      @is_appraisal = params.has_key? :appraisal
    else
      authorize! :edit, @re
      @is_appraisal = @re.appraisal_type != 0
    end

    render layout: 'layout_back'
  end  

  # Handle
  # params: real-estate form
  def save
    is_draft = params.has_key? :draft

    if params[:real_estate][:id].blank?
      params[:real_estate][:user_id] = current_user.id
      real_estate = RealEstate.new
    else 
      real_estate = RealEstate.find(params[:real_estate][:id])
      if real_estate.nil?
        return render json: Hash[status: 1]
      end
    end

    result = real_estate.save_with_params(params[:real_estate], is_draft)

    return render json: result if result[:status] != 0

    if real_estate.errors.any? && !is_draft
      render json: { status: 3, result: real_estate.errors.full_messages }
    else
      render json: { status: 0, result: real_estate.id }
    end
  end

# / Create

  # def preview
  #   @real_estate = RealEstate.create_real_estate params['real_estate']

  #   render json: Hash[status: 1, result: render_to_string(partial: '/real_estates/preview')]
  # end

# My list

  # View
  def my
    # Author
    authorize! :view_my, RealEstate

    @res = RealEstate.where(user_id: current_user.id).order(updated_at: 'desc')

    render layout: 'layout_back'
  end

  # Partial view
  def _my_list
    # Author
    return render json: { status: 6 } if cannot? :view_my, RealEstate

    per = Rails.application.config.item_per_page

    if params[:keyword].blank?
      res = RealEstate.where(user_id: current_user.id)
    else
      res = RealEstate.where(user_id: current_user.id).search(params[:keyword])
    end

    count = res.count

    return render json: { status: 1 } if count === 0

    render json: {
      status: 0,
      result: {
        list: render_to_string(partial: 'real_estates/my_list', locals: { res: res.page(params[:page].to_i, per) }),
        pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per })
      }
    }
  end

  def change_show_status
    RealEstate.update_show_status params[:id], params[:is_show]

    render json: Hash[status: 0]
  end

# / My list

# Pending

  # View
  def pending
    # Author
    return render json: { staus: 6 } if cannot? :approve, RealEstate

    @res = RealEstate.where(is_pending: 1).order(updated_at: 'asc')

    render layout: 'layout_back'
  end

  # Partial view
  def _pending_list
    # Author
    return render json: { staus: 6 } if cannot? :approve, RealEstate

    per = Rails.application.config.item_per_page

    if params[:keyword].blank?
      res = RealEstate.where(is_pending: 1).order(updated_at: 'asc')
    else
      res = RealEstate.where(is_pending: 1).search(params[:keyword])
    end

    count = res.count

    return render json: { status: 1 } if count === 0

    render json: {
      status: 0,
      result: {
        list: render_to_string(partial: 'real_estates/pending_list', locals: { res: res.page(params[:page].to_i, per) }),
        pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per })
      }
    }
  end

  # Handle
  # params: id(*)
  def approve   
    render json: RealEstate.update_pending_status(params[:id], 0)
  end

# / Pending

# Appraise

  # View
  def appraise
    # Author
    return render json: { staus: 6 } if cannot? :appraise, RealEstate

    @res = RealEstate.where('appraisal_type <> 0 AND appraisal_price IS NULL').order(updated_at: 'asc')

    render layout: 'layout_back'
  end

  # Partial view
  def _appraise_list
    # Author
    return render json: { staus: 6 } if cannot? :appraise, RealEstate

    per = Rails.application.config.item_per_page

    if params[:keyword].blank?
      res = RealEstate.where('appraisal_type <> 0 AND appraisal_price IS NULL').order(updated_at: 'asc')
    else
      res = RealEstate.where('appraisal_type <> 0 AND appraisal_price IS NULL').search(params[:keyword])
    end

    count = res.count

    return render json: { status: 1 } if count === 0

    render json: {
      status: 0,
      result: {
        list: render_to_string(partial: 'real_estates/appraise_list', locals: { res: res.page(params[:page].to_i, per) }),
        pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per })
      }
    }
  end
  
# / Appraise

  # Handle
  # params: id(*)
  def delete
    render json: RealEstate.delete_by_id(params[:id])
  end
end
