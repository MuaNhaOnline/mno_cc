require 'test_helper'

class RealEstateRegionUtilitiesControllerTest < ActionController::TestCase
  setup do
    @real_estate_region_utility = real_estate_region_utilities(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:real_estate_region_utilities)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create real_estate_region_utility" do
    assert_difference('RealEstateRegionUtility.count') do
      post :create, real_estate_region_utility: { real_estate_id: @real_estate_region_utility.real_estate_id, region_utility_id: @real_estate_region_utility.region_utility_id }
    end

    assert_redirected_to real_estate_region_utility_path(assigns(:real_estate_region_utility))
  end

  test "should show real_estate_region_utility" do
    get :show, id: @real_estate_region_utility
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @real_estate_region_utility
    assert_response :success
  end

  test "should update real_estate_region_utility" do
    patch :update, id: @real_estate_region_utility, real_estate_region_utility: { real_estate_id: @real_estate_region_utility.real_estate_id, region_utility_id: @real_estate_region_utility.region_utility_id }
    assert_redirected_to real_estate_region_utility_path(assigns(:real_estate_region_utility))
  end

  test "should destroy real_estate_region_utility" do
    assert_difference('RealEstateRegionUtility.count', -1) do
      delete :destroy, id: @real_estate_region_utility
    end

    assert_redirected_to real_estate_region_utilities_path
  end
end
