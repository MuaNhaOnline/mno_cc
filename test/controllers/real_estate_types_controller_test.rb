require 'test_helper'

class RealEstateTypesControllerTest < ActionController::TestCase
  setup do
    @real_estate_type = real_estate_types(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:real_estate_types)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create real_estate_type" do
    assert_difference('RealEstateType.count') do
      post :create, real_estate_type: { code: @real_estate_type.code, name: @real_estate_type.name, options: @real_estate_type.options }
    end

    assert_redirected_to real_estate_type_path(assigns(:real_estate_type))
  end

  test "should show real_estate_type" do
    get :show, id: @real_estate_type
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @real_estate_type
    assert_response :success
  end

  test "should update real_estate_type" do
    patch :update, id: @real_estate_type, real_estate_type: { code: @real_estate_type.code, name: @real_estate_type.name, options: @real_estate_type.options }
    assert_redirected_to real_estate_type_path(assigns(:real_estate_type))
  end

  test "should destroy real_estate_type" do
    assert_difference('RealEstateType.count', -1) do
      delete :destroy, id: @real_estate_type
    end

    assert_redirected_to real_estate_types_path
  end
end
