class PropertyUtilitiesController < ApplicationController
  before_action :set_property_utility, only: [:show, :edit, :update, :destroy]

  # GET /property_utilities
  # GET /property_utilities.json
  def index
    @property_utilities = PropertyUtility.all
  end

  # GET /property_utilities/1
  # GET /property_utilities/1.json
  def show
  end

  # GET /property_utilities/new
  def new
    @property_utility = PropertyUtility.new
  end

  # GET /property_utilities/1/edit
  def edit
  end

  # POST /property_utilities
  # POST /property_utilities.json
  def create
    @property_utility = PropertyUtility.new(property_utility_params)

    respond_to do |format|
      if @property_utility.save
        format.html { redirect_to @property_utility, notice: 'Property utility was successfully created.' }
        format.json { render :show, status: :created, location: @property_utility }
      else
        format.html { render :new }
        format.json { render json: @property_utility.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /property_utilities/1
  # PATCH/PUT /property_utilities/1.json
  def update
    respond_to do |format|
      if @property_utility.update(property_utility_params)
        format.html { redirect_to @property_utility, notice: 'Property utility was successfully updated.' }
        format.json { render :show, status: :ok, location: @property_utility }
      else
        format.html { render :edit }
        format.json { render json: @property_utility.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /property_utilities/1
  # DELETE /property_utilities/1.json
  def destroy
    @property_utility.destroy
    respond_to do |format|
      format.html { redirect_to property_utilities_url, notice: 'Property utility was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_property_utility
      @property_utility = PropertyUtility.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def property_utility_params
      params.require(:property_utility).permit(:name, :code, :options)
    end
end
