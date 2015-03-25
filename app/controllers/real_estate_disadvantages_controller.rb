class RealEstateDisadvantagesController < ApplicationController
  before_action :set_real_estate_disadvantage, only: [:show, :edit, :update, :destroy]

  # GET /real_estate_disadvantages
  # GET /real_estate_disadvantages.json
  def index
    @real_estate_disadvantages = RealEstateDisadvantage.all
  end

  # GET /real_estate_disadvantages/1
  # GET /real_estate_disadvantages/1.json
  def show
  end

  # GET /real_estate_disadvantages/new
  def new
    @real_estate_disadvantage = RealEstateDisadvantage.new
  end

  # GET /real_estate_disadvantages/1/edit
  def edit
  end

  # POST /real_estate_disadvantages
  # POST /real_estate_disadvantages.json
  def create
    @real_estate_disadvantage = RealEstateDisadvantage.new(real_estate_disadvantage_params)

    respond_to do |format|
      if @real_estate_disadvantage.save
        format.html { redirect_to @real_estate_disadvantage, notice: 'Real estate disadvantage was successfully created.' }
        format.json { render :show, status: :created, location: @real_estate_disadvantage }
      else
        format.html { render :new }
        format.json { render json: @real_estate_disadvantage.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /real_estate_disadvantages/1
  # PATCH/PUT /real_estate_disadvantages/1.json
  def update
    respond_to do |format|
      if @real_estate_disadvantage.update(real_estate_disadvantage_params)
        format.html { redirect_to @real_estate_disadvantage, notice: 'Real estate disadvantage was successfully updated.' }
        format.json { render :show, status: :ok, location: @real_estate_disadvantage }
      else
        format.html { render :edit }
        format.json { render json: @real_estate_disadvantage.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /real_estate_disadvantages/1
  # DELETE /real_estate_disadvantages/1.json
  def destroy
    @real_estate_disadvantage.destroy
    respond_to do |format|
      format.html { redirect_to real_estate_disadvantages_url, notice: 'Real estate disadvantage was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_real_estate_disadvantage
      @real_estate_disadvantage = RealEstateDisadvantage.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def real_estate_disadvantage_params
      params.require(:real_estate_disadvantage).permit(:real_estate_id, :disadvantage_id)
    end
end
