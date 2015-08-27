Rails.application.routes.draw do

  get 'testing/index'
  get 'testing/result'
  post 'testing/result'

  root 'home#index'

  get 'home/index'
  get 'home/back'

  # Real estate
  get 'real_estates/index'
  get 'real_estates/category'
  get 'real_estates/create(/:id)' => 'real_estates#create'
  get 'real_estates/my'
  get 'real_estates/_my_list'
  get 'real_estates/pending'
  get 'real_estates/_pending_list'
  get 'real_estates/appraise'
  get 'real_estates/_appraise_list'
  get 'real_estates' => 'real_estates#index'
  get 'real_estates/:id' => 'real_estates#view'
  post 'real_estates/preview' => 'real_estates#preview'
  post 'real_estates/create' => 'real_estates#save'
  post 'real_estates/set_appraisal_company'
  delete 'real_estates/:id' => 'real_estates#delete'
  put 'real_estates/change_show_status/:id/:is_show' => 'real_estates#change_show_status'
  put 'real_estates/approve/:id' => 'real_estates#approve'

  # User
  get 'users/autocomplete'
  get 'signup' => 'users#create'
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
  put 'users/change_type'

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

  # Mail box
  get 'mail_boxes/compose'
  get 'mail_boxes/inbox'
  get 'mail_boxes/_inbox_list'
  get 'mail_boxes/read/:id' => 'mail_boxes#read'
  post 'mail_boxes/send_mail'
  put 'mail_boxes/inbox_remove'
  put 'mail_boxes/sent_remove'

  # Project
  get 'projects/index'
  get 'projects/manager'
  get 'projects/create(/:id)' => 'projects#create'
  get 'projects/build/:id' => 'projects#build'
  get 'projects/:id' => 'projects#view'
  get 'projects' => 'projects#index'
  post 'projects/create' => 'projects#save'
  delete 'projects/:id' => 'projects#delete'
  put 'projects/change_show_status/:id/:is_show' => 'projects#change_show_status'

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

  #Image
  post 'images/upload' => 'images#upload'
  get 'images/:id' => 'images#get_image'

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
end
