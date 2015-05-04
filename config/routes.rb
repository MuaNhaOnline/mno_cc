Rails.application.routes.draw do

  get 'testing/index'
  get 'testing/result'
  post 'testing/result'

  root 'home#index'

  get 'home/index'

  #Real estate
  get 'real_estates/index'
  get 'real_estates/category'
  get 'real_estates/create(/:id)' => 'real_estates#create'
  get 'real_estates/manager'
  get 'real_estates/real_estates_pending'
  post 'real_estates/preview' => 'real_estates#preview'
  post 'real_estates/create' => 'real_estates#save'
  delete 'real_estates/:id' => 'real_estates#delete'
  get 'real_estates/:id' => 'real_estates#view'
  put 'real_estates/change_show_status/:id/:is_show' => 'real_estates#change_show_status'

  #Project
  get 'projects/manager'
  get 'projects/create'
  post 'projects/create' => 'projects#save'
  get 'projects/build/:id' => 'projects#build'

  #Item group
  get 'item_groups/create/:block_id' => 'item_groups#create'

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
