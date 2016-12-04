require 'rails_helper'
require 'support/controller'
require 'support/factory_girl'

RSpec.describe RealEstatesController, type: :controller do
    describe 'GET #index' do
        before do
            @re = create :real_estate
            @res = create :real_estate, is_favorite: true
            get :index
        end

        it 'responses successfully with an HTTP 200 status code' do
            expect(response).to be_success
            expect(response).to have_http_status(200)
        end

        it 'renders index template' do
            expect(response).to render_template('index')
        end

        it 'loads all real-estates' do
            expect(assigns(:favorite_res)).to match_array([@fav_re])
            expect(assigns(:res)).to match_array([@fav_re, @re])
        end
    end

    describe 'XHR #index' do
        it 'renders json response with 0 status code' do
            res = create_list :real_estate, 10
            
            xhr :get, :index
            result = JSON.parse(response.body)

            expect(result['status']).to eq(0)
        end
    end

    describe 'GET #search' do
        let(:re) { create :real_estate }
        let(:fav_re) { create :real_estate, is_favorite: true }

        before do
            get :search
        end

        it 'responses successfully with an HTTP 200 status code' do
            expect(response).to be_success
            expect(response).to have_http_status(200)
        end

        it 'renders search template' do
            expect(response).to render_template('search')
        end

        it 'loads all real-estates' do
            expect(assigns(:res)).to match_array([fav_re, re])
        end
    end

    describe 'XHR #search' do
        let(:res) { create_list :real_estate, 2 }

        before do
            xhr :get, :index
            let(:result) { JSON.parse(response.body) }
        end
 
        it 'renders json response with 0 status code' do
            expect(result['status']).to eq(0)
        end
    end

    describe 'GET #list' do
        context 'request no params[:search]' do
            it 'redirects to res_path if no params[:search]' do
                get :list

                expect(response).to redirect_to(res_path)
            end
        end

        context 'request with params[:search]' do
            let(:re) { create :real_estate, real_estate_type_id: 13 }
            let(:fav_re) { create :real_estate, real_estate_type_id: 13, is_favorite: true }

            before do
                get :list, search: 'nha-pho'
            end

            it 'responses successfully with an HTTP 200 status code' do
                expect(response).to be_success
                expect(response).to have_http_status(200)
            end

            it 'renders search template' do
                expect(response).to render_template('list')
            end

            it 'loads real-estates' do
                expect(assigns(:res)).to match_array([fav_re,re])
            end
        end
    end

    describe 'XHR #search' do
        let(:re) { create_list :real_estate, 2 }

        it 'renders json response with 0 status code' do
            xhr :get, :index
            result = JSON.parse(response.body)

            expect(result['status']).to eq(0)
        end
    end

    describe 'GET #view' do
        context 'success' do
            it 'responses successfully with an HTTP 200 status code' do
                re = create :real_estate

                get :view, full_slug: re.full_slug

                expect(response).to be_success
                expect(response).to have_http_status(200)
            end

            it 'renders view template' do
                re = create :real_estate

                get :view, full_slug: re.full_slug

                expect(response).to render_template('view')
            end

            it 'loads real-estate by id' do
                re = create :real_estate

                get :view, full_slug: re.full_slug

                expect(assigns(:re)).to eq(re)
            end
        end

        context 'fail' do
            after do
                get :view, full_slug: re.full_slug
                expect(response).to redirect_to(root_path)
            end

            it 'redirects to root path with pending real-estate' do
                re = create :real_estate, is_pending: true
            end

            it 'redirects to root path with hide real-estate' do
                re = create :real_estate, is_show: false
            end

            it 'redirects to root path with force hide real-estate' do
                re = create :real_estate, is_force_hide: true
            end
        end
    end

    describe 'GET #create' do
        it 'responses successfully with an HTTP 200 status code' do
            get :create

            expect(response).to be_success
            expect(response).to have_http_status(200)
        end

        it 'renders create_bk template' do
            get :create

            expect(response).to render_template('create_bk')
        end

        it 'loads new real-estate' do
            get :create

            expect(assigns(:re)).to be_a_new(RealEstate)
        end
    end

    describe 'GET #create with :id' do
        it 'responses successfully with an HTTP 200 status code' do
            user = create :user
            re = create :real_estate, user_id: user.id

            login user

            get :create, id: re.id

            expect(response).to be_success
            expect(response).to have_http_status(200)
        end

        it 'renders create_bk template' do
            user = create :user
            re = create :real_estate, user_id: user.id

            login user

            get :create, id: re.id

            expect(response).to render_template('create_bk')
        end

        it 'loads real-estate by id' do
            user = create :user
            re = create :real_estate, user_id: user.id

            login user

            get :create, id: re.id

            expect(assigns(:re)).to eq(re)
        end

        it 'redirects to root path if current user is not author' do
            user = create :user
            re = create :real_estate, user_id: user.id

            other_user = create :user
            login other_user

            get :create, id: re.id

            expect(response).to redirect_to(root_path)
        end

        it 'redirects to root path if user have not logged in' do
            user = create :user
            re = create :real_estate, user_id: user.id

            get :create, id: re.id

            expect(response).to redirect_to(root_path)
        end
    end

    describe 'POST #save' do
        context 'user have not logged' do
            it 'responses successfully' do

            end
        end
    end
end