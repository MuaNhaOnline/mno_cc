class MailMailer < ApplicationMailer
    def notification mail, mail_to
        @mail = mail
        mail to: mail_to, subject: 'Có liên hệ mới'
    end
end
