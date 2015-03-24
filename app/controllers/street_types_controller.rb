class StreetTypesController < ApplicationController
  before_action :set_street_type, only: [:show, :edit, :update, :destroy]

  # GET /street_types
  # GET /street_types.json
  def index
    @street_types = StreetType.all
  end

  # GET /street_types/1
  # GET /street_types/1.json
  def show
  end

  # GET /street_types/new
  def new
    @street_type = StreetType.new
  end

  # GET /street_types/1/edit
  def edit
  end

  # POST /street_types
  # POST /street_types.json
  def create
    @street_type = StreetType.new(street_type_params)

    respond_to do |format|
      if @street_type.save
        format.html { redirect_to @street_type, notice: 'Street type was successfully created.' }
        format.json { render :show, status: :created, location: @street_type }
      else
        format.html { render :new }
        format.json { render json: @street_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /street_types/1
  # PATCH/PUT /street_types/1.json
  def update
    respond_to do |format|
      if @street_type.update(street_type_params)
        format.html { redirect_to @street_type, notice: 'Street type was successfully updated.' }
        format.json { render :show, status: :ok, location: @street_type }
      else
        format.html { render :edit }
        format.json { render json: @street_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /street_types/1
  # DELETE /street_types/1.json
  def destroy
    @street_type.destroy
    respond_to do |format|
      format.html { redirect_to street_types_url, notice: 'Street type was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_street_type
      @street_type = StreetType.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def street_type_params
      params.require(:street_type).permit(:name, :code, :options)
    end
end
