class HomeController < ApplicationController
	layout 'layout_front'
  def index
    	
  end
  
  def back
  	render layout: 'layout_back'
  end
end
