Rails.application.routes.draw do

  # Root

    root 'home#index'

  # / Root

  # Home, shared

    get 'home/index'
    get 'home/back'
    post 'set_width/:width_type' => 'home#set_width'

  # / Home, shared

  # Real estate

    get 'real_estates/index'
    get 'real_estates/demo'
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
    get 'real_estates/search'
    get 'real_estates/:id' => 'real_estates#view'
    get 'real_estates' => 'real_estates#index'
    post 'real_estates/preview' => 'real_estates#preview'
    post 'real_estates/create' => 'real_estates#save'
    post 'real_estates/set_appraisal_company'
    delete 'real_estates/:id' => 'real_estates#delete'
    put 'real_estates/change_show_status/:id/:is_show' => 'real_estates#change_show_status'
    put 'real_estates/change_force_hide_status/:id/:is_force_hide' => 'real_estates#change_force_hide_status'
    put 'real_estates/change_favorite_status/:id/:is_favorite' => 'real_estates#change_favorite_status'
    put 'real_estates/approve/:id' => 'real_estates#approve'

  # / Real estate

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
    get 'auth/:provider/callback' => 'users#facebook_signin'
    get 'users/manager'
    get 'users/_manager_list'
    get 'signout' => 'users#signout'
    get 'users/:id' => 'users#view'
    post 'register' => 'users#save'
    post 'signin' => 'users#signin_handle'
    post 'users/forgot_password' => 'users#forgot_password_handle'
    put 'users/change_type'
    put 'users/change_password'
    put 'users/cancel_change_email/:id' => 'users#cancel_change_email'

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
    delete 'appraisal_companies/:id' => 'appraisal_companies#delete'

  # / Appraisal company

  # Question

    get '/questions/create'
    get '/questions/manager'
    get '/questions/_manager_list'
    post '/questions/create' => 'questions#save'
    post '/questions/answer' => 'questions#answer'
    put '/questions/pin/:id/:status' => 'questions#pin'
    delete '/questions/:id' => 'questions#delete'

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
    put 'mail_boxes/inbox_remove'
    put 'mail_boxes/sent_remove'
    delete 'mail_boxes/' => 'mail_boxes#delete'

  # / Mail box

  # Project

    get 'projects/view'
    get 'projects/demo'
    get 'projects/index'
    get 'projects/create(/:id)' => 'projects#create'
    get 'projects/my'
    get 'projects/_my_list'
    get 'projects/pending'
    get 'projects/_pending_list'
    get 'projects/manager'
    get 'projects/_manager_list'
    get 'projects/search'
    get 'projects/:id' => 'projects#view'
    get 'projects' => 'projects#index'
    post 'projects/create' => 'projects#save'
    delete 'projects/:id' => 'projects#delete'
    put 'projects/change_show_status/:id/:is_show' => 'projects#change_show_status'
    put 'projects/approve/:id' => 'projects#approve'
    put 'projects/change_force_hide_status/:id/:is_force_hide' => 'projects#change_force_hide_status'
    put 'projects/change_favorite_status/:id/:is_favorite' => 'projects#change_favorite_status'

  # / Project

  # Investor

    get 'investors/autocomplete'
    get 'investors/manager'
    get 'investors/_manager_list'
    delete 'investors/:id' => 'investors#delete'
    put 'investors/rename'

  # / Investor

  # Temp

    # Block
    get 'blocks/create/:project_id' => 'blocks#create'
    post 'blocks/create' => 'blocks#save'
    get 'blocks/build/:id' => 'blocks#build'
    put 'blocks/build/:id' => 'blocks#save_building'

    # Item group
    get 'item_groups/create/:block_id' => 'item_groups#create'
    post 'item_groups/create' => 'item_groups#save'

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
