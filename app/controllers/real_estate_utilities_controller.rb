class RealEstateUtilitiesController < ApplicationController
  before_action :set_real_estate_utility, only: [:show, :edit, :update, :destroy]

  # GET /real_estate_utilities
  # GET /real_estate_utilities.json
  def index
    @real_estate_utilities = RealEstateUtility.all
  end

  # GET /real_estate_utilities/1
  # GET /real_estate_utilities/1.json
  def show
  end

  # GET /real_estate_utilities/new
  def new
    @real_estate_utility = RealEstateUtility.new
  end

  # GET /real_estate_utilities/1/edit
  def edit
  end

  # POST /real_estate_utilities
  # POST /real_estate_utilities.json
  def create
    @real_estate_utility = RealEstateUtility.new(real_estate_utility_params)

    respond_to do |format|
      if @real_estate_utility.save
        format.html { redirect_to @real_estate_utility, notice: 'Real estate utility was successfully created.' }
        format.json { render :show, status: :created, location: @real_estate_utility }
      else
        format.html { render :new }
        format.json { render json: @real_estate_utility.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /real_estate_utilities/1
  # PATCH/PUT /real_estate_utilities/1.json
  def update
    respond_to do |format|
      if @real_estate_utility.update(real_estate_utility_params)
        format.html { redirect_to @real_estate_utility, notice: 'Real estate utility was successfully updated.' }
        format.json { render :show, status: :ok, location: @real_estate_utility }
      else
        format.html { render :edit }
        format.json { render json: @real_estate_utility.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /real_estate_utilities/1
  # DELETE /real_estate_utilities/1.json
  def destroy
    @real_estate_utility.destroy
    respond_to do |format|
      format.html { redirect_to real_estate_utilities_url, notice: 'Real estate utility was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_real_estate_utility
      @real_estate_utility = RealEstateUtility.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def real_estate_utility_params
      params.require(:real_estate_utility).permit(:name, :code, :options)
    end
end
