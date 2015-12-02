class SessionsController < ApplicationController
	layout 'layout_back'

	# Index

		# View
		def index

		end

		# Json data
		# params: campaign '' || [], host '' || [], time '' || [], order []
		def get_data
			sessions = Session.search_with_params params
		end

	# / Index

end