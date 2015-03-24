class RealEstateTypesController < ApplicationController
  before_action :set_real_estate_type, only: [:show, :edit, :update, :destroy]

  # GET /real_estate_types
  # GET /real_estate_types.json
  def index
    @real_estate_types = RealEstateType.all
  end

  # GET /real_estate_types/1
  # GET /real_estate_types/1.json
  def show
  end

  # GET /real_estate_types/new
  def new
    @real_estate_type = RealEstateType.new
  end

  # GET /real_estate_types/1/edit
  def edit
  end

  # POST /real_estate_types
  # POST /real_estate_types.json
  def create
    @real_estate_type = RealEstateType.new(real_estate_type_params)

    respond_to do |format|
      if @real_estate_type.save
        format.html { redirect_to @real_estate_type, notice: 'Real estate type was successfully created.' }
        format.json { render :show, status: :created, location: @real_estate_type }
      else
        format.html { render :new }
        format.json { render json: @real_estate_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /real_estate_types/1
  # PATCH/PUT /real_estate_types/1.json
  def update
    respond_to do |format|
      if @real_estate_type.update(real_estate_type_params)
        format.html { redirect_to @real_estate_type, notice: 'Real estate type was successfully updated.' }
        format.json { render :show, status: :ok, location: @real_estate_type }
      else
        format.html { render :edit }
        format.json { render json: @real_estate_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /real_estate_types/1
  # DELETE /real_estate_types/1.json
  def destroy
    @real_estate_type.destroy
    respond_to do |format|
      format.html { redirect_to real_estate_types_url, notice: 'Real estate type was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_real_estate_type
      @real_estate_type = RealEstateType.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def real_estate_type_params
      params.require(:real_estate_type).permit(:name, :code, :options)
    end
end
