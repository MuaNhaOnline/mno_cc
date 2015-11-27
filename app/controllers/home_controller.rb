class HomeController < ApplicationController
	layout 'layout_front'
  def index
    	
  end

  # Search result

    # Handle => View
    # params: search form
    def search
      @res = @res_short = @projects = nil
      @search_params = {}
      if params[:search].present?

        @res = RealEstate.search_with_params params[:search].clone

        params[:search][:is_full] = 'false'
        @res_short = RealEstate.search_with_params params[:search].clone

        @projects = Project.search_with_params params[:search].clone
        
        @search_params = params[:search]
      end

      params.delete :search 
    end

    def _search_list
      params[:page] = params[:page].to_i
      params[:per] = params[:per].to_i

      if params[:part] == 'project'
        projects = Project.search_with_params params

        count = projects.count

        return render json: { status: 1 } if count == 0

        render json: {
          status: 0,
          result: {
            list: render_to_string(partial: 'projects/item_list', locals: { projects: projects.page(params[:page], params[:per]), type: params[:type].to_s }),
            pagination: render_to_string(partial: 'shared/pagination_2', locals: { total: count, per: params[:per], page: params[:page] })
          }
        }
      else
        res = RealEstate.search_with_params params

        count = res.count

        return render json: { status: 1 } if count == 0

        render json: {
          status: 0,
          result: {
            list: render_to_string(partial: 'real_estates/item_list', locals: { res: res.page(params[:page], params[:per]), type: (params[:is_full] == 'true' ? 1 : 3) }),
            pagination: render_to_string(partial: 'shared/pagination_2', locals: { total: count, per: params[:per], page: params[:page] })
          }
        }
      end
    end

  # / Search result

  def blog

  end

  def detail
  end
  
  def back
  	render layout: 'layout_back'
  end

  # Handle
  # params: width_type
  def set_width
  	cookies[:width_type] = params[:width_type]
  	render plain: '0'
  end

  # Handle
  def nothing
    render plain: '0'
  end

  # Handle
  def end_session
    current_user.update(is_online: false) if signed?
    render plain: '0'
  end

  # View/Handle
  # params
  def error
    respond_to do |format|
      format.html { redirect_to("/search?error=#{params[:error]}") }
      format.json { render json: { status: params[:error] == '404' ? 1 : 2, result: params[:error] } }
    end
  end
end