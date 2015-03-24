require 'test_helper'

class RealEstateDisadvantagesControllerTest < ActionController::TestCase
  setup do
    @real_estate_disadvantage = real_estate_disadvantages(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:real_estate_disadvantages)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create real_estate_disadvantage" do
    assert_difference('RealEstateDisadvantage.count') do
      post :create, real_estate_disadvantage: { disadvantage_id: @real_estate_disadvantage.disadvantage_id, real_estate_id: @real_estate_disadvantage.real_estate_id }
    end

    assert_redirected_to real_estate_disadvantage_path(assigns(:real_estate_disadvantage))
  end

  test "should show real_estate_disadvantage" do
    get :show, id: @real_estate_disadvantage
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @real_estate_disadvantage
    assert_response :success
  end

  test "should update real_estate_disadvantage" do
    patch :update, id: @real_estate_disadvantage, real_estate_disadvantage: { disadvantage_id: @real_estate_disadvantage.disadvantage_id, real_estate_id: @real_estate_disadvantage.real_estate_id }
    assert_redirected_to real_estate_disadvantage_path(assigns(:real_estate_disadvantage))
  end

  test "should destroy real_estate_disadvantage" do
    assert_difference('RealEstateDisadvantage.count', -1) do
      delete :destroy, id: @real_estate_disadvantage
    end

    assert_redirected_to real_estate_disadvantages_path
  end
end
