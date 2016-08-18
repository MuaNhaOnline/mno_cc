class BlogsController < ApplicationController
  layout 'layout_front'

	# Index

		# View
		def index

			@blogs = Blog.all

		end

	# / Index

	# Create

		# POST: blog form
		def create
			@blog = Blog.new

			if request.post?
				if @blog.save_with_params params[:blog]
					render json: { status: 0 }
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
			@blog = Blog.find params[:id]

			if request.post?
				if @blog.save_with_params params[:blog]
					render json: { status: 0 }
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
			@blog = Blog.find(params[:id])
		end

	# / View

	# Delete

		# Handle
		# params: id(*)
		def delete
			render json: Blog.delete_by_id(params[:id])
		end

	# / Delete

end
