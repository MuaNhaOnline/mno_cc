require 'test_helper'

class AdvantagesControllerTest < ActionController::TestCase
  setup do
    @advantage = advantages(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:advantages)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create advantage" do
    assert_difference('Advantage.count') do
      post :create, advantage: { code: @advantage.code, name: @advantage.name, options: @advantage.options }
    end

    assert_redirected_to advantage_path(assigns(:advantage))
  end

  test "should show advantage" do
    get :show, id: @advantage
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @advantage
    assert_response :success
  end

  test "should update advantage" do
    patch :update, id: @advantage, advantage: { code: @advantage.code, name: @advantage.name, options: @advantage.options }
    assert_redirected_to advantage_path(assigns(:advantage))
  end

  test "should destroy advantage" do
    assert_difference('Advantage.count', -1) do
      delete :destroy, id: @advantage
    end

    assert_redirected_to advantages_path
  end
end
