class RealEstateMailer < ApplicationMailer
	default from: 'admin@muanhaonline.com.vn'

	def active re
    @re = re
    mail to: @re.user_email, subject: 'Đăng tin MuaNhaOnline'
  end
end
