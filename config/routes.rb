Rails.application.routes.draw do

	scope '(:locale)', locale: /vi|en/ do

		# Root

			root 'home#index'

		# / Root

		# Home, shared

			get ':error', controller: 'home', action: 'error', constraints: {error: /(404|422|500)/}

			get 'home/result'
			get 'home/index'
			# get 'home/back'
			# post 'nothing' => 'home#nothing'
			# post 'end_session' => 'home#end_session'
			# post 'track_session' => 'home#track_session'

		# / Home, shared

		# Search
		
			# get 'search' => 'home#search'
			get '_search_list' => 'home#_search_list'
			get 'tim_kiem' => 'home#search', as: 'search'

		# / Search

		# System groups
		
			get 'quan-ly-nhom-quyen' => 'system_groups#manage', as: 'manage_sgroups'
			get 'system_groups/:action(/:id)', controller: 'system_groups'
			post 'system_groups/:action(/:id)', controller: 'system_groups'
		
		# / System groups

		# Registration
			
			scope 'theo-doi', controller: 'registrations' do
				get 'them', action: 'create', as: 'create_registration'
				get 'sua/:id', action: 'create', as: 'edit_registration'
				get 'xem/:id', action: 'view', as: 'view_registration'
				get '(:action)', action: 'index', as: 'registrations'
			end
		
		# / Registration

		# Real estate

			get 'real_estates/_block_create/:block_id/:group_id' => 'real_estates#_block_create'
			get 'real_estates/_block_item_list/:block_id' => 'real_estates#_block_item_list'
			get 'real_estates/_block_description_item_list/:block_id' => 'real_estates#_block_description_item_list'
			post 'real_estates/preview' => 'real_estates#preview'
			post 'real_estates/create' => 'real_estates#save'
			post 'real_estates/block_create' => 'real_estates#block_save'
			post 'real_estates/save_interact_images'
			post 'real_estates/set_appraisal_company'
			post 'real_estates/delete/:id' => 'real_estates#delete'
			post 'real_estates/change_show_status/:id/:is_show' => 'real_estates#change_show_status'
			post 'real_estates/change_force_hide_status/:id/:is_force_hide' => 'real_estates#change_force_hide_status'
			post 'real_estates/change_favorite_status/:id/:is_favorite' => 'real_estates#change_favorite_status'
			post 'real_estates/approve/:id' => 'real_estates#approve'

			get 'real_estates/groups/get_image_for_interact_build/:id' => 'real_estates#groups_get_image_for_interact_build'
			get 'real_estates/groups/get_data_for_interact_view/:id' => 'real_estates#groups_get_data_for_interact_view'
			get 'real_estates/groups/get_options_for_interact_view/:id' => 'real_estates#groups_get_options_for_interact_view'

			get 'real_estates/floors/get_data_for_interact_view/:id' => 'real_estates#floors_get_data_for_interact_view'
			get 'real_estates/floors/get_options_for_interact_view/:id' => 'real_estates#floors_get_options_for_interact_view'

			get 'bat-dong-san/danh-sach' => 'real_estates#list', as: 're_list'
			get 'bat-dong-san/danh-sach-:search' => 'real_estates#list', as: 're_list_by'
			get 'bat-dong-san/cua-thanh-vien/:user_id' => 'real_estates#list', as: 're_list_of'
			get 'bat-dong-san/dang-tin' => 'real_estates#create', as: 'create_re'
			get 'bat-dong-san/dang-tin/:id' => 'real_estates#create', as: 'edit_re'
			get 'bat-dong-san/dang-tin-tham-dinh(/:id)' => 'real_estates#create', appraisal: true
			get 'bat-dong-san/chinh-sua(/:id)' => 'real_estates#create'
			get 'bat-dong-san/cua-toi' => 'real_estates#my', as: 'my_res'
			get 'bat-dong-san/quan-tam-cua-toi' => 'real_estates#my_favorite', as: 'my_favorite_res'
			get 'bat-dong-san/quan-tam' => 'real_estates#my_favorite'
			get 'bat-dong-san/kiem-duyet' => 'real_estates#pending', as: 'pending_res'
			get 'bat-dong-san/quan-ly' => 'real_estates#manage', as: 'manage_res'
			get 'bat-dong-san/tim-kiem' => 'real_estates#search', as: 'search_res'

			get 'bat-dong-san/:full_slug' => 'real_estates#view', constraints: { full_slug: /(\w|-)*\d+/ }, as: 'view_re'

			get 'bat-dong-san(/:action(/:id))', controller: 'real_estates', action: 'index', as: 'res'
			get 'real_estates(/:action(/:id))', controller: 'real_estates', action: 'index'

			post 'real_estates/:action(/:id)', controller: 'real_estates'

		# / Real estate

		# Project

			get 'du-an/dang-tin(/:id)' => 'projects#create' 
			get 'du-an/chinh-sua(/:id)' => 'projects#create'
			get 'du-an/dang-chi-tiet(/:id)' => 'projects#create_details'
			get 'du-an/sua-chi-tiet(/:id)' => 'projects#create_details'
			get 'du-an/thiet-lap-hinh-anh(/:id)' => 'projects#setup_interact_images'

			get 'du-an/cua-toi' => 'projects#my'
			get 'du-an/yeu-thich-cua-toi' => 'projects#my_favorite'
			get 'du-an/kiem-duyet' => 'projects#pending'
			get 'du-an/quan-ly' => 'projects#manager'
			get 'du-an/yeu-cau' => 'projects#requests_manage'
			
			get 'du-an/:slug', constraints: { slug: /(\w|-)*\d+/ }, controller: 'projects', action: 'view'

			get 'du-an(/:action(/:id))', controller: 'projects', action: 'index', as: 'pjs'
			get 'projects(/:action(/:id))', controller: 'projects', action: 'index'

			post 'projects/:action(/:id)', controller: 'projects'

		# / Project

		# Investor

			get 'chu-dau-tu/them-moi(/:id)', controller: 'investors', action: 'create'
			get 'chu-dau-tu/cap-nhat/:id', controller: 'investors', action: 'create'
			get 'chu-dau-tu/quan-ly', controller: 'investors', action: 'manage'

			get 'chu-dau-tu/:id', constraints: { id: /\d+/ }, controller: 'investors', action: 'view'

			get 'chu-dau-tu(/:action(/:id))', controller: 'investors', action: 'index'
			get 'investors(/:action(/:id))', controller: 'investors', action: 'index'

			post 'investors/:action(/:id)', controller: 'investors'

		# / Investor

		# Block

			get 'blocks/_create/:project_id(/:id)' => 'blocks#_create'
			get 'blocks/_description_item_list/:project_id' => 'blocks#_description_item_list'
			get 'blocks/get_image_for_interact_build/:id' => 'blocks#get_image_for_interact_build'
			get 'blocks/get_data_for_interact_view/:id' => 'blocks#get_data_for_interact_view'
			post 'blocks/create' => 'blocks#save'
			post 'blocks/delete'
			post 'blocks/save_interact_images'

			get 'blocks/floors/_description_item_list/:block_id' => 'blocks#_floors_description_item_list'
			get 'blocks/floors/get_image_for_interact_build/:id' => 'blocks#floors_get_image_for_interact_build'
			get 'blocks/floors/get_data_for_interact_view/:id' => 'blocks#floors_get_data_for_interact_view'
			get 'blocks/floors/get_options_for_interact_view/:id' => 'blocks#floors_get_options_for_interact_view'
			post 'blocks/floors/save_interact_images' => 'blocks#floors_save_interact_images'

			get 'blocks/:action(/:id)', controller: 'blocks'

		# / Block

		# User

			get 'signup' => 'users#create'
			get 'signin' => 'users#signin'
			# get 'signout' => 'users#signout'
			get 'active_account_signin' => 'users#active_account_signin'
			get 'auth/:provider/callback' => 'users#facebook_signin'
			post 'register' => 'users#save'
			post 'signin' => 'users#signin_handle'
			post 'users/forgot_password' => 'users#forgot_password_handle'
			post 'users/change_type'
			post 'users/change_password'
			post 'users/cancel_change_email/:id' => 'users#cancel_change_email'

			get 'dang-ky' => 'users#create'
			get 'dang-nhap' => 'users#signin'
			get 'dang-xuat' => 'users#signout', as: 'signout'
			get 'quen-mat-khau' => 'users#forgot_password'
			get 'trang-ca-nhan' => 'users#view', as: 'profile'
			get 'thanh-vien/cap-nhat' => 'users#create', as: 'update_info'
			get 'thanh-vien/quan-ly' => 'users#manager'
			get 'thanh-vien/danh-sach' => 'users#list', as: 'users'

			get 'thanh-vien/:id' => 'users#view', constraints: { id: /\d+/ }, as: 'view_user'

			get 'users/:id', constraints: { id: /\d+/ }, controller: 'users', action: 'view'

			get 'thanh-vien/:action(/:id)', controller: 'users'
			get 'users/:action(/:id)', controller: 'users'

			post 'dang-nhap' => 'users#signin_handle'

		# / User

		# Contact user info

			get 'contact_user_infos' => 'contact_user_infos#index'
			post 'contact_user_infos/create' => 'contact_user_infos#save'

		# / Contact user info

		# Contact request

			get 'yeu-cau/quan-ly' => 'contact_requests#manage'
			get 'yeu-cau/cua-toi' => 'contact_requests#my'
			get 'yeu-cau/da-nhan-cua-toi' => 'contact_requests#my_received'

		# / Contact request

		# Mail
		
			get 'hop-tin/yeu-cau' => 'mails#requested_list', as: 'requested_mails'
			get 'hop-tin' => 'mails#index', as: 'mails'
		
		# / Mail

		# Log
		
			get 'nhat-ky' => 'logs#index', as: 'logs'
		
		# / Log

		# Session

			get 'sessions' => 'sessions#index'
			get 'sessions/get_data'

		# / Session

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

			scope 'bai-viet', controller: 'blogs' do
				get 'them-moi', action: 'create', as: 'create_blog'
				get 'chinh-sua/:id', action: 'edit', as: 'edit_blog'
				get 'xem/:id', action: 'view', as: 'view_blog'
				get 'quan-ly', action: 'manage', as: 'manage_blogs'
				get '', action: 'index', as: 'blogs'
			end

			get 'blogs(/:action(/:id))' => 'blogs#index'
			post 'blogs/:action(/:id)', controller: 'blogs'

		# / Blog

		# Image content

			post 'image_contents/upload'

		# / Image content

		# Question

			get 'questions/create'
			get 'questions/manager'
			get 'questions/_manager_list'
			post 'questions/create' => 'questions#save'
			post 'questions/answer' => 'questions#answer'
			post 'questions/pin/:id/:status' => 'questions#pin'
			post 'questions/delete/:id' => 'questions#delete'

		# / Questioncontact_request

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

		# Province
		
			get 'thanh-pho/quan-ly' => 'provinces#manage', as: 'manage_provinces'
		
		# / Province

		# District
		
			get 'quan/quan-ly' => 'districts#manage', as: 'manage_districts'
		
		# / District

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

		get ':controller(/:action(/:id))', action: 'index'
		post ':controller/:action(/:id)'

	end

end