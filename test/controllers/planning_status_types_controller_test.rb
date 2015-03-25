require 'test_helper'

class PlanningStatusTypesControllerTest < ActionController::TestCase
  setup do
    @planning_status_type = planning_status_types(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:planning_status_types)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create planning_status_type" do
    assert_difference('PlanningStatusType.count') do
      post :create, planning_status_type: { code: @planning_status_type.code, name: @planning_status_type.name, options: @planning_status_type.options }
    end

    assert_redirected_to planning_status_type_path(assigns(:planning_status_type))
  end

  test "should show planning_status_type" do
    get :show, id: @planning_status_type
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @planning_status_type
    assert_response :success
  end

  test "should update planning_status_type" do
    patch :update, id: @planning_status_type, planning_status_type: { code: @planning_status_type.code, name: @planning_status_type.name, options: @planning_status_type.options }
    assert_redirected_to planning_status_type_path(assigns(:planning_status_type))
  end

  test "should destroy planning_status_type" do
    assert_difference('PlanningStatusType.count', -1) do
      delete :destroy, id: @planning_status_type
    end

    assert_redirected_to planning_status_types_path
  end
end
