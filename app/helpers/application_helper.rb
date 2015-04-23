module ApplicationHelper
  def self.to_i string
    begin
      string.remove(/\D/).to_i
    rescue
      0
    end
  end

  def self.to_f string
    begin
      string.remove(/[^(0-9).]/).to_f
    rescue
      0
    end
  end

  def self.id_format id, code, length = 5
    "\##{code}#{id.to_s.rjust(5, '0')}"
  end
end
