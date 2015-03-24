class LegalRecordTypesController < ApplicationController
  before_action :set_legal_record_type, only: [:show, :edit, :update, :destroy]

  # GET /legal_record_types
  # GET /legal_record_types.json
  def index
    @legal_record_types = LegalRecordType.all
  end

  # GET /legal_record_types/1
  # GET /legal_record_types/1.json
  def show
  end

  # GET /legal_record_types/new
  def new
    @legal_record_type = LegalRecordType.new
  end

  # GET /legal_record_types/1/edit
  def edit
  end

  # POST /legal_record_types
  # POST /legal_record_types.json
  def create
    @legal_record_type = LegalRecordType.new(legal_record_type_params)

    respond_to do |format|
      if @legal_record_type.save
        format.html { redirect_to @legal_record_type, notice: 'Legal record type was successfully created.' }
        format.json { render :show, status: :created, location: @legal_record_type }
      else
        format.html { render :new }
        format.json { render json: @legal_record_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /legal_record_types/1
  # PATCH/PUT /legal_record_types/1.json
  def update
    respond_to do |format|
      if @legal_record_type.update(legal_record_type_params)
        format.html { redirect_to @legal_record_type, notice: 'Legal record type was successfully updated.' }
        format.json { render :show, status: :ok, location: @legal_record_type }
      else
        format.html { render :edit }
        format.json { render json: @legal_record_type.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /legal_record_types/1
  # DELETE /legal_record_types/1.json
  def destroy
    @legal_record_type.destroy
    respond_to do |format|
      format.html { redirect_to legal_record_types_url, notice: 'Legal record type was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_legal_record_type
      @legal_record_type = LegalRecordType.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def legal_record_type_params
      params.require(:legal_record_type).permit(:name, :code, :options)
    end
end
