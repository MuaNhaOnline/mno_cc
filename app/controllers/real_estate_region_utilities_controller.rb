class RealEstateRegionUtilitiesController < ApplicationController
  before_action :set_real_estate_region_utility, only: [:show, :edit, :update, :destroy]

  # GET /real_estate_region_utilities
  # GET /real_estate_region_utilities.json
  def index
    @real_estate_region_utilities = RealEstateRegionUtility.all
  end

  # GET /real_estate_region_utilities/1
  # GET /real_estate_region_utilities/1.json
  def show
  end

  # GET /real_estate_region_utilities/new
  def new
    @real_estate_region_utility = RealEstateRegionUtility.new
  end

  # GET /real_estate_region_utilities/1/edit
  def edit
  end

  # POST /real_estate_region_utilities
  # POST /real_estate_region_utilities.json
  def create
    @real_estate_region_utility = RealEstateRegionUtility.new(real_estate_region_utility_params)

    respond_to do |format|
      if @real_estate_region_utility.save
        format.html { redirect_to @real_estate_region_utility, notice: 'Real estate region utility was successfully created.' }
        format.json { render :show, status: :created, location: @real_estate_region_utility }
      else
        format.html { render :new }
        format.json { render json: @real_estate_region_utility.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /real_estate_region_utilities/1
  # PATCH/PUT /real_estate_region_utilities/1.json
  def update
    respond_to do |format|
      if @real_estate_region_utility.update(real_estate_region_utility_params)
        format.html { redirect_to @real_estate_region_utility, notice: 'Real estate region utility was successfully updated.' }
        format.json { render :show, status: :ok, location: @real_estate_region_utility }
      else
        format.html { render :edit }
        format.json { render json: @real_estate_region_utility.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /real_estate_region_utilities/1
  # DELETE /real_estate_region_utilities/1.json
  def destroy
    @real_estate_region_utility.destroy
    respond_to do |format|
      format.html { redirect_to real_estate_region_utilities_url, notice: 'Real estate region utility was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_real_estate_region_utility
      @real_estate_region_utility = RealEstateRegionUtility.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def real_estate_region_utility_params
      params.require(:real_estate_region_utility).permit(:real_estate_id, :region_utility_id)
    end
end
