class RealEstatesController < ApplicationController
  layout 'layout'
  skip_before_filter :verify_authenticity_token, :only => [:save]

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
    render layout: 'layout_admin'
  end  

  def saves
    real_estate = RealEstate.save_real_estate params['real_estate']

    if real_estate.errors.any?
      render json: Hash[status: 0, result: real_estate.errors.full_messages]
    else
      render json: Hash[status: 1, result: "/real_estates/view/#{real_estate.id}"]
    end
  end

  def manager
    render layout: 'layout_admin'
  end

  def real_estates_pending
    render layout: 'layout_admin'
  end
end
