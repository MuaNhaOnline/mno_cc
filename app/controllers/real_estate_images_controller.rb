class RealEstateImagesController < ApplicationController
  before_action :set_real_estate_image, only: [:show, :edit, :update, :destroy]

  # GET /real_estate_images
  # GET /real_estate_images.json
  def index
    @real_estate_images = RealEstateImage.all
  end

  # GET /real_estate_images/1
  # GET /real_estate_images/1.json
  def show
  end

  # GET /real_estate_images/new
  def new
    @real_estate_image = RealEstateImage.new
  end

  # GET /real_estate_images/1/edit
  def edit
  end

  # POST /real_estate_images
  # POST /real_estate_images.json
  def create
    @real_estate_image = RealEstateImage.new(real_estate_image_params)

    respond_to do |format|
      if @real_estate_image.save
        format.html { redirect_to @real_estate_image, notice: 'Real estate image was successfully created.' }
        format.json { render :show, status: :created, location: @real_estate_image }
      else
        format.html { render :new }
        format.json { render json: @real_estate_image.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /real_estate_images/1
  # PATCH/PUT /real_estate_images/1.json
  def update
    respond_to do |format|
      if @real_estate_image.update(real_estate_image_params)
        format.html { redirect_to @real_estate_image, notice: 'Real estate image was successfully updated.' }
        format.json { render :show, status: :ok, location: @real_estate_image }
      else
        format.html { render :edit }
        format.json { render json: @real_estate_image.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /real_estate_images/1
  # DELETE /real_estate_images/1.json
  def destroy
    @real_estate_image.destroy
    respond_to do |format|
      format.html { redirect_to real_estate_images_url, notice: 'Real estate image was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_real_estate_image
      @real_estate_image = RealEstateImage.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def real_estate_image_params
      params.require(:real_estate_image).permit(:real_estate_id, :image_id)
    end
end
