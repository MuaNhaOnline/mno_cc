class HomeController < ApplicationController
	layout 'layout_front'
  def index
    	
  end
  
  def register
  	render layout: 'layout_back'
  end
end
