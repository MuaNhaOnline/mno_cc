class RealEstateAdvantagesController < ApplicationController
  before_action :set_real_estate_advantage, only: [:show, :edit, :update, :destroy]

  # GET /real_estate_advantages
  # GET /real_estate_advantages.json
  def index
    @real_estate_advantages = RealEstateAdvantage.all
  end

  # GET /real_estate_advantages/1
  # GET /real_estate_advantages/1.json
  def show
  end

  # GET /real_estate_advantages/new
  def new
    @real_estate_advantage = RealEstateAdvantage.new
  end

  # GET /real_estate_advantages/1/edit
  def edit
  end

  # POST /real_estate_advantages
  # POST /real_estate_advantages.json
  def create
    @real_estate_advantage = RealEstateAdvantage.new(real_estate_advantage_params)

    respond_to do |format|
      if @real_estate_advantage.save
        format.html { redirect_to @real_estate_advantage, notice: 'Real estate advantage was successfully created.' }
        format.json { render :show, status: :created, location: @real_estate_advantage }
      else
        format.html { render :new }
        format.json { render json: @real_estate_advantage.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /real_estate_advantages/1
  # PATCH/PUT /real_estate_advantages/1.json
  def update
    respond_to do |format|
      if @real_estate_advantage.update(real_estate_advantage_params)
        format.html { redirect_to @real_estate_advantage, notice: 'Real estate advantage was successfully updated.' }
        format.json { render :show, status: :ok, location: @real_estate_advantage }
      else
        format.html { render :edit }
        format.json { render json: @real_estate_advantage.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /real_estate_advantages/1
  # DELETE /real_estate_advantages/1.json
  def destroy
    @real_estate_advantage.destroy
    respond_to do |format|
      format.html { redirect_to real_estate_advantages_url, notice: 'Real estate advantage was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_real_estate_advantage
      @real_estate_advantage = RealEstateAdvantage.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def real_estate_advantage_params
      params.require(:real_estate_advantage).permit(:real_estate_id, :advantage_id)
    end
end
