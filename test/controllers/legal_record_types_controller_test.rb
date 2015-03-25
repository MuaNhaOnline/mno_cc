require 'test_helper'

class LegalRecordTypesControllerTest < ActionController::TestCase
  setup do
    @legal_record_type = legal_record_types(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:legal_record_types)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create legal_record_type" do
    assert_difference('LegalRecordType.count') do
      post :create, legal_record_type: { code: @legal_record_type.code, name: @legal_record_type.name, options: @legal_record_type.options }
    end

    assert_redirected_to legal_record_type_path(assigns(:legal_record_type))
  end

  test "should show legal_record_type" do
    get :show, id: @legal_record_type
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @legal_record_type
    assert_response :success
  end

  test "should update legal_record_type" do
    patch :update, id: @legal_record_type, legal_record_type: { code: @legal_record_type.code, name: @legal_record_type.name, options: @legal_record_type.options }
    assert_redirected_to legal_record_type_path(assigns(:legal_record_type))
  end

  test "should destroy legal_record_type" do
    assert_difference('LegalRecordType.count', -1) do
      delete :destroy, id: @legal_record_type
    end

    assert_redirected_to legal_record_types_path
  end
end
