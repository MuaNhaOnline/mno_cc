class InvestorsAddAvatar2 < ActiveRecord::Migration
  def change
    add_attachment :investors, :avatar
  end
end
