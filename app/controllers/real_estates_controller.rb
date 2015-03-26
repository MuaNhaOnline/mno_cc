class RealEstatesController < ApplicationController
  layout 'layout'
  skip_before_filter :verify_authenticity_token, :only => [:save]

  def index

  end

  def category

  end

  def view

  end

  def create
    @options = RealEstate.getOptionsBeforeCreate

    render layout: 'layout_admin'
  end

  def save
    realEstate = RealEstate.saveRealEstate params['real_estate']

    @a = realEstate.id
  end
end
