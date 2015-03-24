require 'test_helper'

class RealEstateRealEstateUtilitiesControllerTest < ActionController::TestCase
  setup do
    @real_estate_real_estate_utility = real_estate_real_estate_utilities(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:real_estate_real_estate_utilities)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create real_estate_real_estate_utility" do
    assert_difference('RealEstateRealEstateUtility.count') do
      post :create, real_estate_real_estate_utility: { real_estate_id: @real_estate_real_estate_utility.real_estate_id, real_estate_utility_id: @real_estate_real_estate_utility.real_estate_utility_id }
    end

    assert_redirected_to real_estate_real_estate_utility_path(assigns(:real_estate_real_estate_utility))
  end

  test "should show real_estate_real_estate_utility" do
    get :show, id: @real_estate_real_estate_utility
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @real_estate_real_estate_utility
    assert_response :success
  end

  test "should update real_estate_real_estate_utility" do
    patch :update, id: @real_estate_real_estate_utility, real_estate_real_estate_utility: { real_estate_id: @real_estate_real_estate_utility.real_estate_id, real_estate_utility_id: @real_estate_real_estate_utility.real_estate_utility_id }
    assert_redirected_to real_estate_real_estate_utility_path(assigns(:real_estate_real_estate_utility))
  end

  test "should destroy real_estate_real_estate_utility" do
    assert_difference('RealEstateRealEstateUtility.count', -1) do
      delete :destroy, id: @real_estate_real_estate_utility
    end

    assert_redirected_to real_estate_real_estate_utilities_path
  end
end
