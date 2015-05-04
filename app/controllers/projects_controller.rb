class ProjectsController < ApplicationController
  layout 'layout_front'
  skip_before_filter :verify_authenticity_token, :only => [:save]

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

  def save
    project = Project.save_project params[:project]

    render json: project
  end

  def build
    @project_id = params[:id]

    render layout: 'layout_back'
  end
end
