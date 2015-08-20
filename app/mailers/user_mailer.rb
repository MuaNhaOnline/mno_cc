class UserMailer < ApplicationMailer
	default from: 'buseo9x@gmail.com'

	def active_account user
    @user = user
    @url  = 'http://example.com/login'
    mail to: 'lebinhchieu@gmail.com', subject: 'Kích hoạt tài khoản MuaNhaOnline'
  end
end
