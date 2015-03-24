class RegionUtilitiesController < ApplicationController
  before_action :set_region_utility, only: [:show, :edit, :update, :destroy]

  # GET /region_utilities
  # GET /region_utilities.json
  def index
    @region_utilities = RegionUtility.all
  end

  # GET /region_utilities/1
  # GET /region_utilities/1.json
  def show
  end

  # GET /region_utilities/new
  def new
    @region_utility = RegionUtility.new
  end

  # GET /region_utilities/1/edit
  def edit
  end

  # POST /region_utilities
  # POST /region_utilities.json
  def create
    @region_utility = RegionUtility.new(region_utility_params)

    respond_to do |format|
      if @region_utility.save
        format.html { redirect_to @region_utility, notice: 'Region utility was successfully created.' }
        format.json { render :show, status: :created, location: @region_utility }
      else
        format.html { render :new }
        format.json { render json: @region_utility.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /region_utilities/1
  # PATCH/PUT /region_utilities/1.json
  def update
    respond_to do |format|
      if @region_utility.update(region_utility_params)
        format.html { redirect_to @region_utility, notice: 'Region utility was successfully updated.' }
        format.json { render :show, status: :ok, location: @region_utility }
      else
        format.html { render :edit }
        format.json { render json: @region_utility.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /region_utilities/1
  # DELETE /region_utilities/1.json
  def destroy
    @region_utility.destroy
    respond_to do |format|
      format.html { redirect_to region_utilities_url, notice: 'Region utility was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_region_utility
      @region_utility = RegionUtility.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def region_utility_params
      params.require(:region_utility).permit(:name, :code, :options)
    end
end
