Rails.application.routes.draw do

  # Root

    root 'home#index'

  # / Root

  # Home, shared

    get '/404', to: 'home#error', defaults: { error: '404' }
    get '/422', to: 'home#error', defaults: { error: '422' }
    get '/500', to: 'home#error', defaults: { error: '500' }

    get 'home/result'
    get 'home/index'
    get 'home/back'
    get 'home/blog'
    post 'set_width/:width_type' => 'home#set_width'
    post 'nothing' => 'home#nothing'
    post 'end_session' => 'home#end_session'

  # / Home, shared

  # Search
  
    get 'search' => 'home#search'
    get '_search_list' => 'home#_search_list'

  # / Search

  # Real estate

    get 'real_estates/index'
    get 'real_estates/demo'
    get 'real_estate/list'
    get 'real_estates/estimate'
    get 'real_estates/category'
    get 'real_estates/create(/:id)' => 'real_estates#create'
    get 'real_estates/active/:id' => 'real_estates#active'
    get 'real_estates/delete/:id' => 'real_estates#delete'
    get 'real_estates/my'
    get 'real_estates/_my_list'
    get 'real_estates/pending'
    get 'real_estates/_pending_list'
    get 'real_estates/manager'
    get 'real_estates/_manager_list'
    get 'real_estates/appraise'
    get 'real_estates/_appraise_list'
    get 'real_estates/my_favorite'
    get 'real_estates/_my_favorite_list'
    get 'real_estates/search'
    get 'real_estates/get_gallery/:id' => 'real_estates#get_gallery'
    get 'real_estates/:id' => 'real_estates#view'
    get 'real_estates' => 'real_estates#index'
    post 'real_estates/preview' => 'real_estates#preview'
    post 'real_estates/create' => 'real_estates#save'
    post 'real_estates/set_appraisal_company'
    post 'real_estates/delete/:id' => 'real_estates#delete'
    post 'real_estates/change_show_status/:id/:is_show' => 'real_estates#change_show_status'
    post 'real_estates/change_force_hide_status/:id/:is_force_hide' => 'real_estates#change_force_hide_status'
    post 'real_estates/change_favorite_status/:id/:is_favorite' => 'real_estates#change_favorite_status'
    post 'real_estates/approve/:id' => 'real_estates#approve'
    post 'real_estates/user_favorite/:id/:is_add' => 'real_estates#user_favorite'

  # / Real estate

  # Project

    get 'projects/view'
    get 'projects/demo'
    get 'projects/index'
    get 'projects/create(/:id)' => 'projects#create'
    get 'projects/create_details(/:id)' => 'projects#create_details'
    get 'projects/my'
    get 'projects/_my_list'
    get 'projects/my_favorite'
    get 'projects/_my_favorite_list'
    get 'projects/pending'
    get 'projects/_pending_list'
    get 'projects/manager'
    get 'projects/_manager_list'
    get 'projects/search'
    get 'projects/get_gallery/:id' => 'projects#get_gallery'
    get 'projects/:id' => 'projects#view'
    get 'projects' => 'projects#index'
    post 'projects/create' => 'projects#save'
    post 'projects/delete/:id' => 'projects#delete'
    post 'projects/change_show_status/:id/:is_show' => 'projects#change_show_status'
    post 'projects/approve/:id' => 'projects#approve'
    post 'projects/change_force_hide_status/:id/:is_force_hide' => 'projects#change_force_hide_status'
    post 'projects/change_favorite_status/:id/:is_favorite' => 'projects#change_favorite_status'
    post 'projects/user_favorite/:id/:is_add' => 'projects#user_favorite'

  # / Project

  # Block

    get 'blocks/_create'

  # / Block

  # User

    get 'users/autocomplete'
    get 'signup' => 'users#create'
    get 'users/active_callout/:id' => 'users#active_callout'
    get 'users/active_account/:id' => 'users#active_account'
    get 'active_account_signin' => 'users#active_account_signin'
    get 'users/resend_active_account/:id' => 'users#resend_active_account'
    get 'users/forgot_password'
    get 'users/create/:id' => 'users#create'  
    get 'users/check_unique_account'
    get 'users/check_unique_email'
    get 'signin' => 'users#signin'
    get 'users/view_all'
    get 'users/_view_all_list'
    get 'users/manager'
    get 'users/_manager_list'
    get 'users/visit_counter'
    get 'signout' => 'users#signout'
    get 'auth/:provider/callback' => 'users#facebook_signin'
    get 'users/:id' => 'users#view'
    post 'register' => 'users#save'
    post 'signin' => 'users#signin_handle'
    post 'users/forgot_password' => 'users#forgot_password_handle'
    post 'users/change_type'
    post 'users/change_password'
    post 'users/cancel_change_email/:id' => 'users#cancel_change_email'

  # / User

  # Appraisal company

    get 'appraisal_companies/autocomplete'
    get 'appraisal_companies/create(/:id)' => 'appraisal_companies#create'
    get 'appraisal_companies/manager'
    get 'appraisal_companies/_manager_list'
    get 'appraisal_companies/appraise'
    get 'appraisal_companies/_appraise_list'
    post 'appraisal_companies/create' => 'appraisal_companies#save'
    post 'appraisal_companies/set_price'
    post 'appraisal_companies/delete/:id' => 'appraisal_companies#delete'

  # / Appraisal company

  # Blog

    get 'blogs/create(/:id)' => 'blogs#create'
    get 'blogs' => 'blogs#index'
    post 'blogs/create' => 'blogs#save'

  # / Blog

  # Question

    get 'questions/create'
    get 'questions/manager'
    get 'questions/_manager_list'
    post 'questions/create' => 'questions#save'
    post 'questions/answer' => 'questions#answer'
    post 'questions/pin/:id/:status' => 'questions#pin'
    post 'questions/delete/:id' => 'questions#delete'

  # / Question

  # Mail box

    get 'mail_boxes/compose(/:id)' => 'mail_boxes#compose'
    get 'mail_boxes/inbox'
    get 'mail_boxes/_inbox_list'
    get 'mail_boxes/sent'
    get 'mail_boxes/_sent_list'
    get 'mail_boxes/draft'
    get 'mail_boxes/_draft_list'
    get 'mail_boxes/read/:id' => 'mail_boxes#read'
    get 'mail_boxes' => 'mail_boxes#inbox'
    post 'mail_boxes/send_mail'
    post 'mail_boxes/inbox_remove'
    post 'mail_boxes/sent_remove'
    post 'mail_boxes/delete' => 'mail_boxes#delete'

  # / Mail box

  # Investor

    get 'investors/autocomplete'
    get 'investors/manager'
    get 'investors/_manager_list'
    post 'investors/delete/:id' => 'investors#delete'
    post 'investors/rename'

  # / Investor

  # Temp

    #Business
    get 'businesses/manager'
    get 'businesses/create'
    get 'businesses/create_category'  

    #Province
    get 'provinces/get_full_data/:id' => 'provinces#get_full_data'

    #Temporary file
    post 'temporary_files/upload'

    resources :businesses do
      collection do
        get 'index'
      end
    end
    resources :projects do
      collection do
        get 'index'
        get 'view'
      end
    end
    resources :investors
    resources :project_types
    resources :news
    resources :streets
    resources :wards
    resources :districts
    resources :provinces
    resources :property_utilities
    resources :images
    resources :region_utilities
    resources :disadvantages
    resources :advantages
    resources :planning_status_types
    resources :legal_record_types
    resources :constructional_levels
    resources :directions
    resources :real_estate_types
    resources :street_types
    resources :units
    resources :currencies
    resources :purposes

    # The priority is based upon order of creation: first created -> highest priority.
    # See how all your routes lay out with "rake routes".

    # You can have the root of your site routed with "root"
    # root 'welcome#index'

    # Example of regular route:
    #   get 'products/:id' => 'catalog#view'

    # Example of named route that can be invoked with purchase_url(id: product.id)
    #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

    # Example resource route (maps HTTP verbs to controller actions automatically):
    #   resources :products

    # Example resource route with options:
    #   resources :products do
    #     member do
    #       get 'short'
    #       post 'toggle'
    #     end
    #
    #     collection do
    #       get 'sold'
    #     end
    #   end

    # Example resource route with sub-resources:
    #   resources :products do
    #     resources :comments, :sales
    #     resource :seller
    #   end

    # Example resource route with more complex sub-resources:
    #   resources :products do
    #     resources :comments
    #     resources :sales do
    #       get 'recent', on: :collection
    #     end
    #   end

    # Example resource route with concerns:
    #   concern :toggleable do
    #     post 'toggle'
    #   end
    #   resources :posts, concerns: :toggleable
    #   resources :photos, concerns: :toggleable

    # Example resource route within a namespace:
    #   namespace :admin do
    #     # Directs /admin/products/* to Admin::ProductsController
    #     # (app/controllers/admin/products_controller.rb)
    #     resources :products
    #   end

  # / Temp
end
