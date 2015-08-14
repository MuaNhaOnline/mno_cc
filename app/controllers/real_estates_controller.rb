class RealEstatesController < ApplicationController
  layout 'layout_front'
  skip_before_filter :verify_authenticity_token

  def index
    @real_estates = RealEstate.where(is_draft: 0, is_show: 1).limit(6)
  end

  def category

  end

  def view
  #   begin
  #     @real_estate = RealEstate.find(params['id'])
  #   rescue
  #     redirect_to '/real_estates/index'
  #   end
  end

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

    render layout: 'layout_back'
  end  

  def save
    is_draft = params.has_key? :draft

    if params[:real_estate][:id].blank?
      real_estate = RealEstate.new
    else 
      real_estate = RealEstate.find(params[:real_estate][:id])
      if real_estate.nil?
        return render json: Hash[status: 1]
      end
    end

    real_estate.save_with_params(params[:real_estate], is_draft)

    if real_estate.errors.any? && !is_draft
      render json: Hash[status: 3, result: real_estate.errors.full_messages]
    else
      render json: Hash[status: 0, result: real_estate.id]
    end
  end

  # def preview
  #   @real_estate = RealEstate.create_real_estate params['real_estate']

  #   render json: Hash[status: 1, result: render_to_string(partial: '/real_estates/preview')]
  # end

  def manager
    @res = RealEstate.order(updated_at: 'desc')

    render layout: 'layout_back'
  end

  def _manager_list
    per = Rails.application.config.item_per_page

    if params[:keyword].blank?
      res = RealEstate.all
    else
      res = RealEstate.search(params[:keyword])
    end

    count = res.count

    return render json: { status: 1 } if count === 0

    render json: {
      status: 0,
      result: {
        list: render_to_string(partial: 'real_estates/manager_list', locals: { res: res.page(params[:page].to_i, per) }),
        pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per })
      }
    }
  end

  def pending
    @res = RealEstate.where(is_pending: 1).order(updated_at: 'asc')

    render layout: 'layout_back'
  end

  def _pending_list
    per = Rails.application.config.item_per_page

    if params[:keyword].blank?
      res = RealEstate.where(is_pending: 1).order(updated_at: 'asc')
    else
      res = RealEstate.where(is_pending: 1).search(params[:keyword]).order(updated_at: 'asc')
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

  def change_show_status
    RealEstate.update_show_status params[:id], params[:is_show]

    render json: Hash[status: 0]
  end

  def approve
    RealEstate.update_pending_status params[:id], 0

    render json: Hash[status: 0]
  end

  def delete
    begin
      RealEstate.delete params[:id]
      render json: Hash[status: 0]
    rescue
      render json: Hash[status: 2]
    end
  end
end
