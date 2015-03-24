require 'test_helper'

class RealEstateUtilitiesControllerTest < ActionController::TestCase
  setup do
    @real_estate_utility = real_estate_utilities(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:real_estate_utilities)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create real_estate_utility" do
    assert_difference('RealEstateUtility.count') do
      post :create, real_estate_utility: { code: @real_estate_utility.code, name: @real_estate_utility.name, options: @real_estate_utility.options }
    end

    assert_redirected_to real_estate_utility_path(assigns(:real_estate_utility))
  end

  test "should show real_estate_utility" do
    get :show, id: @real_estate_utility
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @real_estate_utility
    assert_response :success
  end

  test "should update real_estate_utility" do
    patch :update, id: @real_estate_utility, real_estate_utility: { code: @real_estate_utility.code, name: @real_estate_utility.name, options: @real_estate_utility.options }
    assert_redirected_to real_estate_utility_path(assigns(:real_estate_utility))
  end

  test "should destroy real_estate_utility" do
    assert_difference('RealEstateUtility.count', -1) do
      delete :destroy, id: @real_estate_utility
    end

    assert_redirected_to real_estate_utilities_path
  end
end
