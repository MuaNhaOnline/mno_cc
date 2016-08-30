class BlogsController < ApplicationController
	layout 'front_layout'

	# Index

		# View
		def index

			@blogs = Blog.all

		end

	# / Index

	# Create

		# POST: blog form
		def create
			authorize! :manage, Blog
			
			@blog = Blog.new

			if request.post?
				if @blog.save_with_params params[:blog]
					render json: { status: 0, result: { redirect: _route_helpers.blogs_path } }
				else
					render json: { status: 2 }
				end

				return
			end

			render layout: 'layout_back'
		end

		# GET: id
		# POST: blog form
		def edit
			authorize! :manage, Blog

			@blog = Blog.find params[:id]

			if request.post?
				if @blog.save_with_params params[:blog]
					render json: { status: 0, result: { redirect: _route_helpers.blogs_path } }
				else
					render json: { status: 2 }
				end

				return
			end

			render layout: 'layout_back'
		end

	# / Create

	# View

		# View
		# params: id(*)
		def view
			@blog = Blog.find params[:id]
		end

	# / View

	# Delete

		# Handle
		# params: id(*)
		def delete
			authorize! :manage, Blog

			render json: Blog.delete_by_id(params[:id])
		end

	# / Delete

	# Manage
	
		def manage
			# Authorize
			authorize! :manage, Blog

			# Get params
			page		=	(params[:page] || 1).to_i
			per			=	(params[:per] || 30).to_i

			# Get blogs
			blogs = Blog.order(created_at: :desc)

			# Render
			respond_to do |f|
				f.html {
					render 'manage',
						layout: 'layout_back',
						locals: {
							blogs: 	blogs,
							page:	page,
							per:	per
						}
				}
				f.json {
					blogs_in_page = blogs.page page, per

					# Check if empty
					if blogs_in_page.count == 0
						render json: {
							status: 1
						}
					else
						render json: {
							status: 0,
							result: {
								list: render_to_string(
									partial:	'manage',
									formats:	:html,
									locals:		{
													blogs: blogs_in_page
												}
								),
								paginator: render_to_string(
									partial: '/shared/pagination',
									formats: :html,
									locals: {
										total: 	blogs.count,
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
	
	# / Manage

end
