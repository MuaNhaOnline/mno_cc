class ProjectsController < ApplicationController
  layout 'layout_front'
  skip_before_filter :verify_authenticity_token, :only => [:save, :delete, :change_show_status]

  def index
    @projects = Project.where(is_draft: 0, is_show: 1).limit(6)
  end

  def view
    begin
      @project = Project.find(params['id'])
    rescue
      redirect_to '/projects/index'
    end
  end

  def create
    if (params.include?('id'))
      begin
        @project = Project.find(params['id'])
      rescue
        @project = Project.new
      end
    else
      @project = Project.new
    end

  	render layout: 'layout_back'
  end

  def save
    is_draft = params.include? :draft

    project = params['project'][:id].blank? ?
      Project.save_project(params['project'], is_draft) :
      Project.update_project(params['project'], is_draft)

    if project.errors.any? && !is_draft
      render json: Hash[status: 0, result: project.errors.full_message]
    else
      render json: Hash[status: 1, result: project]
    end
  end

  def build
    @project_id = params[:id]

    render layout: 'layout_back'
  end
  
  def manager
    @projects = Project.all.order updated_at: 'desc'

    render layout: 'layout_back'
  end

  def change_show_status
    Project.update_show_status params[:id], params[:is_show]

    render json: Hash[status: 1]
  end

  def delete
    begin
      Project.delete params['id']
      render json: Hash[status: 1]
    rescue
      render json: Hash[status: 0]
    end
  end
end
