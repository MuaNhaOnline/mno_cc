module ApplicationHelper
  def self.format_i string
    begin
      string.remove(/\D/)
    rescue
      0
    end
  end

  def self.format_f string
    begin
      string.remove(/[^(0-9).]/)
    rescue
      0
    end
  end

  def self.id_format id, code, length = 5
    "\##{code}#{id.to_s.rjust(5, '0')}"
  end

  def self.isValidEmail email
    email =~ /^([a-z0-9_\.\-])+\@(([a-z0-9\-])+\.)+([a-z0-9]{2,4})+$/i
  end

  def self.md5_encode string
    require 'digest/md5'
    Digest::MD5.hexdigest(string)
  end
end
