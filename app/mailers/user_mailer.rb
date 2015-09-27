class UserMailer < ApplicationMailer
	default from: 'admin@muanhaonline.com.vn'

	def active_account user
    @user = user
    mail to: @user.email, subject: 'Kích hoạt tài khoản MuaNhaOnline'
  end

  def restore_password user, new_password
  	@user = user
  	@new_password = new_password
  	mail to: @user.email, subject: 'Khôi phục mật khẩu'
  end

  def active_old_email user
    @user = user
    mail to: @user.email, subject: 'Xác nhận thay đổi email'
  end

  def active_new_email user
    @user = user
    mail to: @user.params['new_email'], subject: 'Xác nhận thay đổi email'
  end
end
