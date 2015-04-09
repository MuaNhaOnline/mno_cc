class BusinessesController < ApplicationController
  layout 'layout'

  def index

  end

  def manager
  	render layout: 'layout_admin'
  end

  def create
  	render layout: 'layout_admin'
  end
  
  def create_category
  	render layout: 'layout_admin'
  end
end
