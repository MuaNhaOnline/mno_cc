class ProjectsController < ApplicationController
  layout 'layout_front'

  def index

  end

  def view

  end

  def manager
  	render layout: 'layout_back'
  end

  def create
  	render layout: 'layout_back'
  end
end
