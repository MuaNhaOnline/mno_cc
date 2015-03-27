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
    @options = RealEstate.get_options_before_create

    render layout: 'layout_admin'
  end

  def save
    real_estate = RealEstate.save_real_estate params['real_estate']

    redirect_to "/real_estates/view/#{real_estate.id}"
  end
end
