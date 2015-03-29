require 'test_helper'

class PropertyUtilitiesControllerTest < ActionController::TestCase
  setup do
    @property_utility = property_utilities(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:property_utilities)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create property_utility" do
    assert_difference('PropertyUtility.count') do
      post :create, property_utility: { code: @property_utility.code, name: @property_utility.name, options: @property_utility.options }
    end

    assert_redirected_to property_utility_path(assigns(:property_utility))
  end

  test "should show property_utility" do
    get :show, id: @property_utility
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @property_utility
    assert_response :success
  end

  test "should update property_utility" do
    patch :update, id: @property_utility, property_utility: { code: @property_utility.code, name: @property_utility.name, options: @property_utility.options }
    assert_redirected_to property_utility_path(assigns(:property_utility))
  end

  test "should destroy property_utility" do
    assert_difference('PropertyUtility.count', -1) do
      delete :destroy, id: @property_utility
    end

    assert_redirected_to property_utilities_path
  end
end
