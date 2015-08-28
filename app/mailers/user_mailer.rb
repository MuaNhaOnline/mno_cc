class UserMailer < ApplicationMailer
	default from: 'buseo9x@gmail.com'

	def active_account user
    @user = user
    mail to: @user.email, subject: 'Kích hoạt tài khoản MuaNhaOnline'
  end

  def restore_password user, new_password
  	@user = user
  	@new_password = new_password
  	mail to: @user.email, subject: 'Khôi phục mật khẩu'
  end
end
