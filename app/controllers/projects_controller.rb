class ProjectsController < ApplicationController
  layout 'layout_front'

# Index

  # View
  def index
    @projects = Project.where(is_draft: 0, is_show: 1).limit(6)
  end

def demo
end

# / Index

# View

  # View
  # params: id(*)
  def view
  
  end

# / View

# Create

  # View
  # params: id
  def create
    if params.has_key? :id
      begin
        @p = Project.find params[:id]
      rescue
        @p = Project.new
      end
    else
      @p = Project.new
    end
    
    # Author
    if @p.new_record?
      authorize! :create, Project
    else
      authorize! :edit, @p
    end

  	render layout: 'layout_back'
  end

  # Handle
  # params: project form
  def save
    is_draft = params.has_key? :draft

    if params[:project][:id].blank?
      params[:project][:user_id] = current_user.id
      project = Project.new
    else 
      project = Project.find(params[:project][:id])
      if project.nil?
        return render json: Hash[status: 1]
      end
    end

    result = project.save_with_params(params[:project], is_draft)

    return render json: result if result[:status] != 0

    render json: { status: 0, result: project.id }
  end

# / Create

# My list

  # View
  def my
    # Author
    authorize! :view_my, Project

    @projects = Project.where(user_id: current_user.id).order(updated_at: 'desc')

    render layout: 'layout_back'
  end

  # Partial view
  # params: keyword
  def _my_list
    # Author
    return render json: { status: 6 } if cannot? :view_my, Project

    per = Rails.application.config.item_per_page

    if params[:keyword].blank?
      projects = Project.where(user_id: current_user.id)
    else
      projects = Project.where(user_id: current_user.id).search(params[:keyword])
    end

    count = projects.count

    return render json: { status: 1 } if count === 0

    render json: {
      status: 0,
      result: {
        list: render_to_string(partial: 'projects/my_list', locals: { projects: projects.page(params[:page].to_i, per) }),
        pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per })
      }
    }
  end

  def change_show_status
    Project.update_show_status params[:id], params[:is_show]

    render json: { status: 0 }
  end

# / My list

# Pending

  # View
  def pending
    # Author
    authorize! :manager, Project

    @projects = Project.get_pending.order(updated_at: 'asc')

    render layout: 'layout_back'
  end

  # Partial view
  # params: keyword
  def _pending_list
    # Author
    return render json: { staus: 6 } if cannot? :manager, Project

    per = Rails.application.config.item_per_page

    if params[:keyword].blank?
      ps = Project.get_pending.order(updated_at: 'asc')
    else
      ps = Project.get_pending.search(params[:keyword])
    end

    count = ps.count

    return render json: { status: 1 } if count === 0

    render json: {
      status: 0,
      result: {
        list: render_to_string(partial: 'projects/pending_list', locals: { projects: ps.page(params[:page].to_i, per) }),
        pagination: render_to_string(partial: 'shared/pagination', locals: { total: count, per: per })
      }
    }
  end

  # Handle
  # params: id(*)
  def approve   
    render json: Project.update_pending_status(params[:id], 0)
  end

# / Pending

# Delete

  # Handle
  # params: id(*)
  def delete
    render json: Project.delete_by_id(params[:id])
  end

# / Delete
end
