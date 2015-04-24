class RealEstatesController < ApplicationController
  layout 'layout_front'
  skip_before_filter :verify_authenticity_token, :only => [:save, :delete, :preview, :change_show_status]

  def index

  end

  def category

  end

  def view
    begin
      @real_estate = RealEstate.find(params['id'])
    rescue
      redirect_to '/real_estates/index'
    end
  end

  def create
      if (params.include?('id'))
        begin
          @real_estate = RealEstate.find(params['id'])
        rescue
          @real_estate = RealEstate.new
        end
      else
        @real_estate = RealEstate.new
      end

    render layout: 'layout_back'
  end  

  def save
    is_draft = params.include? :draft

    real_estate = params['real_estate'][:id].blank? ?
      RealEstate.save_real_estate(params['real_estate'], is_draft) :
      RealEstate.update_real_estate(params['real_estate'], is_draft)

    if real_estate.errors.any? && !is_draft
      render json: Hash[status: 0, result: real_estate.errors.full_messages]
    else
      render json: Hash[status: 1, result: real_estate.id]
    end
  end

  def preview
    @real_estate = RealEstate.create_real_estate params['real_estate']

    render json: Hash[status: 1, result: render_to_string(partial: '/real_estates/preview'), formats: [:html]]
  end

  def manager
    @real_estates = RealEstate.all

    render layout: 'layout_back'
  end

  def change_show_status
    RealEstate.update_show_status params[:id], params[:is_show]

    render json: Hash[status: 1]
  end

  def delete
    begin
      RealEstate.delete params['id']
      render json: Hash[status: 1]
    rescue
      render json: Hash[status: 0]
    end
  end

  def real_estates_pending
    render layout: 'layout_back'
  end
end
