require 'test_helper'

class DisadvantagesControllerTest < ActionController::TestCase
  setup do
    @disadvantage = disadvantages(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:disadvantages)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create disadvantage" do
    assert_difference('Disadvantage.count') do
      post :create, disadvantage: { code: @disadvantage.code, name: @disadvantage.name, options: @disadvantage.options }
    end

    assert_redirected_to disadvantage_path(assigns(:disadvantage))
  end

  test "should show disadvantage" do
    get :show, id: @disadvantage
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @disadvantage
    assert_response :success
  end

  test "should update disadvantage" do
    patch :update, id: @disadvantage, disadvantage: { code: @disadvantage.code, name: @disadvantage.name, options: @disadvantage.options }
    assert_redirected_to disadvantage_path(assigns(:disadvantage))
  end

  test "should destroy disadvantage" do
    assert_difference('Disadvantage.count', -1) do
      delete :destroy, id: @disadvantage
    end

    assert_redirected_to disadvantages_path
  end
end
