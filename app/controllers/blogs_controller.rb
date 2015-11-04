class BlogsController < ApplicationController
  layout 'layout_front'

	# Index

		# View
		def index

			@blogs = Blog.all

		end

	# / Index

	# Create

		# View
		# params: (id)
		def create
			# Author
			authorize! :create, Blog

			@blog = params[:id].present? ? Blog.find(params[:id]) : Blog.new

			render layout: 'layout_back'
		end

		# Handle
		# params: blog form
		def save
			blog = params[:blog][:id].present? ? Blog.find(params[:blog][:id]) : Blog.new

			result = blog.save_with_params params[:blog]

			if result[:status] != 0
				render json: { status: 2 }
			else
				render json: { status: 0 }
			end
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
