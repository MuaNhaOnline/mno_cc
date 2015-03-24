require 'test_helper'

class RealEstateAdvantagesControllerTest < ActionController::TestCase
  setup do
    @real_estate_advantage = real_estate_advantages(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:real_estate_advantages)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create real_estate_advantage" do
    assert_difference('RealEstateAdvantage.count') do
      post :create, real_estate_advantage: { advantage_id: @real_estate_advantage.advantage_id, real_estate_id: @real_estate_advantage.real_estate_id }
    end

    assert_redirected_to real_estate_advantage_path(assigns(:real_estate_advantage))
  end

  test "should show real_estate_advantage" do
    get :show, id: @real_estate_advantage
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @real_estate_advantage
    assert_response :success
  end

  test "should update real_estate_advantage" do
    patch :update, id: @real_estate_advantage, real_estate_advantage: { advantage_id: @real_estate_advantage.advantage_id, real_estate_id: @real_estate_advantage.real_estate_id }
    assert_redirected_to real_estate_advantage_path(assigns(:real_estate_advantage))
  end

  test "should destroy real_estate_advantage" do
    assert_difference('RealEstateAdvantage.count', -1) do
      delete :destroy, id: @real_estate_advantage
    end

    assert_redirected_to real_estate_advantages_path
  end
end
