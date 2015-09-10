class RealEstateMailer < ApplicationMailer
	default from: 'buseo9x@gmail.com'

	def active re
    @re = re
    mail to: @re.user_email, subject: 'Đăng tin MuaNhaOnline'
  end
end
