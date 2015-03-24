class AdvantagesController < ApplicationController
  before_action :set_advantage, only: [:show, :edit, :update, :destroy]

  # GET /advantages
  # GET /advantages.json
  def index
    @advantages = Advantage.all
  end

  # GET /advantages/1
  # GET /advantages/1.json
  def show
  end

  # GET /advantages/new
  def new
    @advantage = Advantage.new
  end

  # GET /advantages/1/edit
  def edit
  end

  # POST /advantages
  # POST /advantages.json
  def create
    @advantage = Advantage.new(advantage_params)

    respond_to do |format|
      if @advantage.save
        format.html { redirect_to @advantage, notice: 'Advantage was successfully created.' }
        format.json { render :show, status: :created, location: @advantage }
      else
        format.html { render :new }
        format.json { render json: @advantage.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /advantages/1
  # PATCH/PUT /advantages/1.json
  def update
    respond_to do |format|
      if @advantage.update(advantage_params)
        format.html { redirect_to @advantage, notice: 'Advantage was successfully updated.' }
        format.json { render :show, status: :ok, location: @advantage }
      else
        format.html { render :edit }
        format.json { render json: @advantage.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /advantages/1
  # DELETE /advantages/1.json
  def destroy
    @advantage.destroy
    respond_to do |format|
      format.html { redirect_to advantages_url, notice: 'Advantage was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_advantage
      @advantage = Advantage.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def advantage_params
      params.require(:advantage).permit(:name, :code, :options)
    end
end
