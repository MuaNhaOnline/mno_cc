class RealEstateMailer < ApplicationMailer
	def active re
    @re = re
    mail to: @re.user_email, subject: 'Đăng tin MuaNhaOnline'
  end
end
