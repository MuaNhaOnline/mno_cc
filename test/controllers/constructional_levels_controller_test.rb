require 'test_helper'

class ConstructionalLevelsControllerTest < ActionController::TestCase
  setup do
    @constructional_level = constructional_levels(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:constructional_levels)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create constructional_level" do
    assert_difference('ConstructionalLevel.count') do
      post :create, constructional_level: { code: @constructional_level.code, name: @constructional_level.name, options: @constructional_level.options }
    end

    assert_redirected_to constructional_level_path(assigns(:constructional_level))
  end

  test "should show constructional_level" do
    get :show, id: @constructional_level
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @constructional_level
    assert_response :success
  end

  test "should update constructional_level" do
    patch :update, id: @constructional_level, constructional_level: { code: @constructional_level.code, name: @constructional_level.name, options: @constructional_level.options }
    assert_redirected_to constructional_level_path(assigns(:constructional_level))
  end

  test "should destroy constructional_level" do
    assert_difference('ConstructionalLevel.count', -1) do
      delete :destroy, id: @constructional_level
    end

    assert_redirected_to constructional_levels_path
  end
end
