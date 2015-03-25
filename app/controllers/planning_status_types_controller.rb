class PlanningStatusTypesController < ApplicationController
  before_action :set_planning_status_type, only: [:show, :edit, :update, :destroy]

  # GET /planning_status_types
  # GET /planning_status_types.json
  def index
    @planning_status_types = PlanningStatusType.all
  end

  # GET /planning_status_types/1
  # GET /planning_status_types/1.json
  def show
  end

  # GET /planning_status_types/new
  def new
    @planning_status_type = PlanningStatusType.new
  end

  # GET /planning_status_types/1/edit
  def edit
  end

  # POST /planning_status_types
  # POST /planning_status_types.json
  def create
    @planning_status_type = PlanningStatusType.new(planning_status_type_params)

    respond_to do |format|
      if @planning_status_type.save
        format.html { redirect_to @planning_status_type, notice: 'Planning status type was successfully created.' }
        format.json { render :show, status: :created, location: @planning_status_type }
      else
        format.html { render :new }
        format.json { render json: @planning_status_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /planning_status_types/1
  # PATCH/PUT /planning_status_types/1.json
  def update
    respond_to do |format|
      if @planning_status_type.update(planning_status_type_params)
        format.html { redirect_to @planning_status_type, notice: 'Planning status type was successfully updated.' }
        format.json { render :show, status: :ok, location: @planning_status_type }
      else
        format.html { render :edit }
        format.json { render json: @planning_status_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /planning_status_types/1
  # DELETE /planning_status_types/1.json
  def destroy
    @planning_status_type.destroy
    respond_to do |format|
      format.html { redirect_to planning_status_types_url, notice: 'Planning status type was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_planning_status_type
      @planning_status_type = PlanningStatusType.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def planning_status_type_params
      params.require(:planning_status_type).permit(:name, :code, :options)
    end
end
