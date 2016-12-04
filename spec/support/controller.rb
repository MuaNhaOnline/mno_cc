module Controller

	# Current user

		def login user
			session[:user_id] = user.id
			User.current = user
			User.ability
		end
	
	# / Current user
		
end

include Controller

RSpec.configure do |config|
	config.include Controller, type: :controller
end