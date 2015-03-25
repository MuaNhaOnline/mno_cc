class ConstructionalLevelsController < ApplicationController
  before_action :set_constructional_level, only: [:show, :edit, :update, :destroy]

  # GET /constructional_levels
  # GET /constructional_levels.json
  def index
    @constructional_levels = ConstructionalLevel.all
  end

  # GET /constructional_levels/1
  # GET /constructional_levels/1.json
  def show
  end

  # GET /constructional_levels/new
  def new
    @constructional_level = ConstructionalLevel.new
  end

  # GET /constructional_levels/1/edit
  def edit
  end

  # POST /constructional_levels
  # POST /constructional_levels.json
  def create
    @constructional_level = ConstructionalLevel.new(constructional_level_params)

    respond_to do |format|
      if @constructional_level.save
        format.html { redirect_to @constructional_level, notice: 'Constructional level was successfully created.' }
        format.json { render :show, status: :created, location: @constructional_level }
      else
        format.html { render :new }
        format.json { render json: @constructional_level.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /constructional_levels/1
  # PATCH/PUT /constructional_levels/1.json
  def update
    respond_to do |format|
      if @constructional_level.update(constructional_level_params)
        format.html { redirect_to @constructional_level, notice: 'Constructional level was successfully updated.' }
        format.json { render :show, status: :ok, location: @constructional_level }
      else
        format.html { render :edit }
        format.json { render json: @constructional_level.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /constructional_levels/1
  # DELETE /constructional_levels/1.json
  def destroy
    @constructional_level.destroy
    respond_to do |format|
      format.html { redirect_to constructional_levels_url, notice: 'Constructional level was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_constructional_level
      @constructional_level = ConstructionalLevel.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def constructional_level_params
      params.require(:constructional_level).permit(:name, :code, :options)
    end
end
