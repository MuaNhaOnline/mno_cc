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
end
