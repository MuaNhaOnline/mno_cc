class RealEstatesController < ApplicationController
  layout 'layout'
  skip_before_filter :verify_authenticity_token, :only => [:save, :delete]

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

    render layout: 'layout_admin'
  end  

  def save
    real_estate = RealEstate.save_real_estate params['real_estate']

    if real_estate.errors.any?
      render json: Hash[status: 0, result: real_estate.errors.full_messages]
    else
      render json: Hash[status: 1, result: real_estate.id]
    end
  end

  def manager
    @real_estates = RealEstate.all

    render layout: 'layout_admin'
  end

  def real_estates_pending
    render layout: 'layout_admin'
  end

  def delete
    begin
      RealEstate.delete params['id']
      render json: Hash[status: 1]
    rescue
      render json: Hash[status: 0, result: real_estate.errors.full_messages]
    end
  end
end
