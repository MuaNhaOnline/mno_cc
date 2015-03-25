require 'test_helper'

class RealEstateImagesControllerTest < ActionController::TestCase
  setup do
    @real_estate_image = real_estate_images(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:real_estate_images)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create real_estate_image" do
    assert_difference('RealEstateImage.count') do
      post :create, real_estate_image: { image_id: @real_estate_image.image_id, real_estate_id: @real_estate_image.real_estate_id }
    end

    assert_redirected_to real_estate_image_path(assigns(:real_estate_image))
  end

  test "should show real_estate_image" do
    get :show, id: @real_estate_image
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @real_estate_image
    assert_response :success
  end

  test "should update real_estate_image" do
    patch :update, id: @real_estate_image, real_estate_image: { image_id: @real_estate_image.image_id, real_estate_id: @real_estate_image.real_estate_id }
    assert_redirected_to real_estate_image_path(assigns(:real_estate_image))
  end

  test "should destroy real_estate_image" do
    assert_difference('RealEstateImage.count', -1) do
      delete :destroy, id: @real_estate_image
    end

    assert_redirected_to real_estate_images_path
  end
end
