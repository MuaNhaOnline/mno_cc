class ProjectsController < ApplicationController
  layout 'layout'

  def index

  end

  def view

  end

  def manager
  	render layout: 'layout_admin'
  end

  def create
  	render layout: 'layout_admin'
  end
end
