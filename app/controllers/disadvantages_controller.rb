class DisadvantagesController < ApplicationController
  before_action :set_disadvantage, only: [:show, :edit, :update, :destroy]

  # GET /disadvantages
  # GET /disadvantages.json
  def index
    @disadvantages = Disadvantage.all
  end

  # GET /disadvantages/1
  # GET /disadvantages/1.json
  def show
  end

  # GET /disadvantages/new
  def new
    @disadvantage = Disadvantage.new
  end

  # GET /disadvantages/1/edit
  def edit
  end

  # POST /disadvantages
  # POST /disadvantages.json
  def create
    @disadvantage = Disadvantage.new(disadvantage_params)

    respond_to do |format|
      if @disadvantage.save
        format.html { redirect_to @disadvantage, notice: 'Disadvantage was successfully created.' }
        format.json { render :show, status: :created, location: @disadvantage }
      else
        format.html { render :new }
        format.json { render json: @disadvantage.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /disadvantages/1
  # PATCH/PUT /disadvantages/1.json
  def update
    respond_to do |format|
      if @disadvantage.update(disadvantage_params)
        format.html { redirect_to @disadvantage, notice: 'Disadvantage was successfully updated.' }
        format.json { render :show, status: :ok, location: @disadvantage }
      else
        format.html { render :edit }
        format.json { render json: @disadvantage.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /disadvantages/1
  # DELETE /disadvantages/1.json
  def destroy
    @disadvantage.destroy
    respond_to do |format|
      format.html { redirect_to disadvantages_url, notice: 'Disadvantage was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_disadvantage
      @disadvantage = Disadvantage.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def disadvantage_params
      params.require(:disadvantage).permit(:name, :code, :options)
    end
end
