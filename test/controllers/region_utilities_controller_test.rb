require 'test_helper'

class RegionUtilitiesControllerTest < ActionController::TestCase
  setup do
    @region_utility = region_utilities(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:region_utilities)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create region_utility" do
    assert_difference('RegionUtility.count') do
      post :create, region_utility: { code: @region_utility.code, name: @region_utility.name, options: @region_utility.options }
    end

    assert_redirected_to region_utility_path(assigns(:region_utility))
  end

  test "should show region_utility" do
    get :show, id: @region_utility
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @region_utility
    assert_response :success
  end

  test "should update region_utility" do
    patch :update, id: @region_utility, region_utility: { code: @region_utility.code, name: @region_utility.name, options: @region_utility.options }
    assert_redirected_to region_utility_path(assigns(:region_utility))
  end

  test "should destroy region_utility" do
    assert_difference('RegionUtility.count', -1) do
      delete :destroy, id: @region_utility
    end

    assert_redirected_to region_utilities_path
  end
end
