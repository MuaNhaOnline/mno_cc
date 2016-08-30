class RegistrationsController < ApplicationController
	layout 'front_layout'

	# View
	def create
		@registration = params[:id].present? ? ReRegistration.find(params[:id]) : ReRegistration.new

		# Post
		if request.post?
			if signed?
				params[:re_registration][:user_type]	=	'user'
				params[:re_registration][:user_id]		=	current_user.id
			else
				# New & get contact
				contact_user = _save_contact_user_info params[:contact_info]

				# Check if error
				return render json: { status: 2 } unless contact_user

				params[:re_registration][:user_type]	=	'contact_user'
				params[:re_registration][:user_id]		=	contact_user.id
			end

			if @registration.save_with_params params[:re_registration]
				response = {
					status: 0,
					result: Rails.application.routes.url_helpers.view_registration_path(id: @registration.id)
				}
			else
				response = {
					status: 2
				}
			end

			return render json: response
		end

		# Get
		if params[:search].present?
			# Purpose
			if params[:search][:purpose].present?
				purpose = Purpose.find params[:search][:purpose]

				@registration.purpose_id = params[:search][:purpose]

				# Price
				case purpose.code
				when 'transfer', 'rent'
					if params[:search][:price_from].present?
						@registration.min_rent_price = params[:search][:price_from].to_f * 1000000
					end
					if params[:search][:price_to].present?
						@registration.max_rent_price = params[:search][:price_to].to_f * 1000000
					end
				else
					if params[:search][:price_from].present?
						@registration.min_sell_price = params[:search][:price_from].to_f * 1000000
					end
					if params[:search][:price_to].present?
						@registration.max_sell_price = params[:search][:price_to].to_f * 1000000
					end
				end
			end

			# Re type
			if params[:search][:real_estate_type].present?
				@registration.real_estate_types << RealEstateType.find(params[:search][:real_estate_type])
			end

			# Area
			if params[:search][:area_from].present?
				@registration.min_area = params[:search][:area_from]
			end
			if params[:search][:area_to].present?
				@registration.max_area = params[:search][:area_to]
			end

			# Position
			if params[:search][:district].present?
				@registration.locations << ReRegistrationLocation.create(object_type: 'district', object_id: params[:search][:district])
			elsif params[:search][:province].present?
				@registration.locations << ReRegistrationLocation.create(object_type: 'province', object_id: params[:search][:province])
			end
		end
	end

	def index
		# Authorize
		authorize! :view_my, ReRegistration

		@registrations = ReRegistration.of_current_user.order(expires_at: :desc)
	end

	# params: id, page
	def view
		reg		=	ReRegistration.find params[:id]
		page	=	params[:page] || 1
		per		=	6

		authorize! :view, @reg

		respond_to do |f|
			f.html {
				render 'view',
					locals: {
						reg:	reg,
						page: 	page,
						per: 	per
					}
			}
			f.json {
				res_in_page = reg.matching_real_estates.page page, per

				# Check if empty
				if res_in_page.count == 0
					render json: {
						status: 1
					}
				else
					render json: {
						status: 0,
						result: {
							list:		render_to_string(
											partial:	'real_estates/items_list_2',
											formats:	:html,
											locals:		{
															res:	res_in_page
														}
										),
							paginator:	render_to_string(
											partial: '/shared/front_paginator',
											formats: :html,
											locals: {
												total: 	reg.matching_real_estates.count,
												per: 	per,
												page: 	page
											}
										)
						}
					}
				end
			}
		end
	end

	# params: id
	def delete
		return render json: { status: 1 } unless request.post?

		registration = ReRegistration.find params[:id]

		authorize! :delete, registration

		if registration.delete
			render json: { status: 0, result: { redirect: Rails.application.routes.url_helpers.registrations_path } }
		else
			render json: { status: 2 }
		end
	end

end
