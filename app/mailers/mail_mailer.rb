class MailMailer < ApplicationMailer
    def notification mail_object, mail_to
        @mail = mail_object
        mail to: mail_to, subject: 'Có liên hệ mới'
    end
end
