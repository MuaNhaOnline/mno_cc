class RealEstateMailer < ApplicationMailer
	def active re
    @re = re
    mail to: re.user_type == 'user' ? re.user.email : re.contact_user.email, subject: 'Đăng tin MuaNhaOnline'
  end
end
